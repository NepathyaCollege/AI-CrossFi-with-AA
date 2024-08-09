// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultiTokenKeeper.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

interface IAutomationRegistrar {
    struct RegistrationParams {
        string name;
        bytes encryptedEmail;
        address upkeepContract;
        uint32 gasLimit;
        address adminAddress;
        uint8 triggerType;
        bytes checkData;
        bytes triggerConfig;
        bytes offchainConfig;
        uint96 amount;
    }

    function registerUpkeep(RegistrationParams calldata requestParams) external returns (uint256);
}

contract MultiTokenKeeperFactory {
    address public uniswapRouter;
    address public usdtAddress;
    address public aggregatorManager;
    address public keeperRegistryAddress;
    address public linkTokenAddress;
    uint256 public linkAmount;

    mapping(address => address) public multiTokenKeeperByOwner;

    event MultiTokenKeeperCreated(address indexed owner, address indexed multiTokenKeeperAddress, uint256 upkeepId);

    constructor(
        address _uniswapRouter,
        address _usdtAddress,
        address _aggregatorManager,
        address _keeperRegistryAddress,
        address _linkTokenAddress,
        uint256 _linkAmount
    ) {
        uniswapRouter = _uniswapRouter;
        usdtAddress = _usdtAddress;
        aggregatorManager = _aggregatorManager;
        keeperRegistryAddress = _keeperRegistryAddress;
        linkTokenAddress = _linkTokenAddress;
        linkAmount = _linkAmount;
    }

    function createAndRegisterMultiTokenKeeper(address owner) external returns (address multiTokenKeeperAddress, uint256 upkeepId) {
        require(multiTokenKeeperByOwner[owner] == address(0), "MultiTokenKeeper already exists for this owner");

        // Deploy a new MultiTokenKeeper contract
        MultiTokenKeeper multiTokenKeeper = new MultiTokenKeeper(uniswapRouter, usdtAddress, aggregatorManager);
        multiTokenKeeperAddress = address(multiTokenKeeper);

        // Approve the KeeperRegistry to spend LINK tokens
        LinkTokenInterface linkToken = LinkTokenInterface(linkTokenAddress);
        // require(linkToken.transferFrom(msg.sender, address(this), linkAmount), "LINK transfer failed");
        linkToken.approve(keeperRegistryAddress, linkAmount);

        // Register the MultiTokenKeeper contract with the KeeperRegistry
        IAutomationRegistrar keeperRegistry = IAutomationRegistrar(keeperRegistryAddress);
        IAutomationRegistrar.RegistrationParams memory params = IAutomationRegistrar.RegistrationParams({
            name: "MultiTokenKeeper Upkeep",
            encryptedEmail: "",
            upkeepContract: multiTokenKeeperAddress,
            gasLimit: 500000,
            adminAddress: owner,
            triggerType: 0, // Example trigger type, adjust according to your use case
            checkData: "",
            triggerConfig: "",
            offchainConfig: "",
            amount: uint96(linkAmount)
        });
        upkeepId = keeperRegistry.registerUpkeep(params);

        // Store the newly created MultiTokenKeeper contract address by owner
        multiTokenKeeperByOwner[owner] = multiTokenKeeperAddress;

        emit MultiTokenKeeperCreated(owner, multiTokenKeeperAddress, upkeepId);
    }

    function getMultiTokenKeeper(address owner) external view returns (address) {
        return multiTokenKeeperByOwner[owner];
    }
}
