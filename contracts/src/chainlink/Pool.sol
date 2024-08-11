// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";
import {SendParam} from "./interface/SendParam.sol";
import "../helpers/Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

enum PoolOperationMode {
    BURN_AND_MINT,
    TRANSFER_ONLY
}

contract Pool is CCIPReceiver, Ownable {
    using SafeERC20 for IERC20;

    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error UnauthorizedSender(uint64 sourceChain, address sender);

    IERC20 private s_linkToken;

    Token public token;

    bytes32 private s_lastReceivedMessageId; // Store the last received messageId.

    SendParam public testSendParam;

    // Variable to store the current operation mode of the pool
    PoolOperationMode public operationMode;

    // Mapping to store allowed chain selectors and sender addresses
    mapping(uint64 => address) public allowedSenders;

    // Event emitted when a message is sent to another chain.
    // The chain selector of the destination chain.
    // The address of the receiver on the destination chain.
    // The enum type being sent.
    // the token address used to pay CCIP fees.
    // The fees paid for sending the CCIP message.
    event MessageSent( // The unique ID of the CCIP message.
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        address feeToken,
        uint256 fees
    );

    /// @notice Constructor initializes the contract with the router address.
    /// @param _router The address of the router contract.
    /// @param _link The address of the link contract.
    constructor(address _router, address _link, address _token, PoolOperationMode _operationMode)
        CCIPReceiver(_router)
        Ownable(msg.sender)
    {
        s_linkToken = IERC20(_link);
        token = Token(_token);
        operationMode = _operationMode;
    }

    /// @notice Adds an allowed sender for a specific chain selector
    /// @param _chainSelector The chain selector for the source chain
    /// @param _sender The address of the allowed sender on that chain
    function addAllowedSender(uint64 _chainSelector, address _sender) external onlyOwner {
        allowedSenders[_chainSelector] = _sender;
    }

    function sendMessagePayLINK(uint64 _destinationChainSelector, address _receiver, SendParam calldata _sendParam)
        external
        returns (bytes32 messageId)
    {
        if (operationMode == PoolOperationMode.BURN_AND_MINT) {
            // Burn tokens from the sender's address before sending
            token.burnFrom(msg.sender, _sendParam.amount);
        } else if (operationMode == PoolOperationMode.TRANSFER_ONLY) {
            // Transfer tokens to the contract
            token.transferFrom(msg.sender, address(this), _sendParam.amount);
        }

        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(_receiver, _sendParam, address(s_linkToken));

        // Initialize a router client instance to interact with cross-chain router
        IRouterClient router = IRouterClient(this.getRouter());

        // Get the fee required to send the CCIP message
        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);
        if (fees > s_linkToken.balanceOf(address(this))) {
            revert NotEnoughBalance(s_linkToken.balanceOf(address(this)), fees);
        }

        // Approve the Router to transfer LINK tokens on contract's behalf. It will spend the fees in LINK
        s_linkToken.approve(address(router), fees);
        // Send the CCIP message through the router and store the returned CCIP message ID
        messageId = router.ccipSend(_destinationChainSelector, evm2AnyMessage);

        // Emit an event with message details
        emit MessageSent(messageId, _destinationChainSelector, _receiver, address(s_linkToken), fees);

        // Return the CCIP message ID
        return messageId;
    }

    /// @notice Construct a CCIP message.
    /// @dev This function will create an EVM2AnyMessage struct with all the necessary information for sending an enum type.
    /// @param _receiver The address of the receiver.
    /// @param _sendParam The SendParam struct containing additional data.
    /// @param _feeTokenAddress The address of the token used for fees. Set address(0) for native gas.
    /// @return Client.EVM2AnyMessage Returns an EVM2AnyMessage struct which contains information for sending a CCIP message.
    function _buildCCIPMessage(address _receiver, SendParam calldata _sendParam, address _feeTokenAddress)
        private
        pure
        returns (Client.EVM2AnyMessage memory)
    {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        return Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver), // ABI-encoded receiver address
            data: abi.encode(_sendParam), // ABI-encoded SendParam and MessageType
            tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array as no tokens are transferred
            extraArgs: Client._argsToBytes(
                // Additional arguments, setting gas limit
                Client.EVMExtraArgsV1({gasLimit: 200_000})
            ),
            // Set the feeToken to a feeTokenAddress, indicating specific asset will be used for fees
            feeToken: _feeTokenAddress
        });
    }

    /// Handle a received message
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
        address allowedSender = allowedSenders[any2EvmMessage.sourceChainSelector];
        address decodedSender = abi.decode(any2EvmMessage.sender, (address));

        if (allowedSender != decodedSender) {
            revert UnauthorizedSender(any2EvmMessage.sourceChainSelector, decodedSender);
        }

        s_lastReceivedMessageId = any2EvmMessage.messageId; // Fetch the messageId
        (SendParam memory sendParam) = abi.decode(any2EvmMessage.data, (SendParam)); // ABI-decoding of the sent data

        testSendParam = sendParam;

        // Handle tokens based on the operation mode
        if (operationMode == PoolOperationMode.BURN_AND_MINT) {
            token.mint(sendParam.to, sendParam.amount);
        } else if (operationMode == PoolOperationMode.TRANSFER_ONLY) {
            token.transfer(sendParam.to, sendParam.amount);
        }

        emit MessageReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector, // Fetch the source chain identifier (aka selector)
            sendParam.to,
            sendParam.amount
        );
    }

    event MessageReceived(
        bytes32 indexed messageId, uint64 indexed sourceChainSelector, address receiver, uint256 amount
    );
}
