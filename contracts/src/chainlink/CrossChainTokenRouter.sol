// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import "./Pool.sol";
import {SendParam} from "./interface/SendParam.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "../helpers/Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrossChainTokenRouter is Ownable {
    struct PoolInfo {
        address sourcePool;
        address destinationPool;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Mapping from chain ID and token address to PoolInfo.
     * The key is the chain ID, which represents different chains or networks.
     * The value is another mapping where the key is the token address and the value is a PoolInfo struct
     * containing source and destination pool addresses.
     */
    mapping(uint64 => mapping(address => PoolInfo)) public poolTrack;

    // Event emitted when a pool is registered
    event PoolRegistered(uint64 destinationSelector, address token, address sourcePool, address destPool);
    event DestinationPoolUpdated(uint64 destinationSelector, address token, address oldDestPool, address newDestPool);

    function setPoolTrack(uint64 destinationSelector, address tokenAddress, address sourcePool, address destinationPool)
        external
        onlyOwner
    {
        require(tokenAddress != address(0), "Token address cannot be zero");
        require(sourcePool != address(0), "Source pool cannot be zero address");
        require(destinationPool != address(0), "Destination pool cannot be zero address");

        // Update the poolTrack mapping with the provided details
        poolTrack[destinationSelector][tokenAddress] =
            PoolInfo({sourcePool: sourcePool, destinationPool: destinationPool});

        // Emit an event to log the registration of the pool
        emit PoolRegistered(destinationSelector, tokenAddress, sourcePool, destinationPool);
    }

    // Function to get the PoolInfo
    function getPoolInfo(uint64 destinationSelector, address token) external view returns (PoolInfo memory) {
        return poolTrack[destinationSelector][token];
    }

    function bridgeToken(address tokenAddress, uint256 destinationSelector, address receiver, uint256 amount)
        external
    {
        uint64 destinationSelector64 = uint64(destinationSelector);

        PoolInfo memory poolInfo = poolTrack[destinationSelector64][tokenAddress];
        require(poolInfo.destinationPool != address(0), "Destination pool not registered");

        // Transfer tokens to the source pool

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);

        IERC20(tokenAddress).approve(poolInfo.sourcePool, amount);

        // Call the sendMessagePayLINK function on the source pool
        Pool(poolInfo.sourcePool).sendMessagePayLINK(
            destinationSelector64, poolInfo.destinationPool, SendParam({to: receiver, amount: amount})
        );
    }
}
