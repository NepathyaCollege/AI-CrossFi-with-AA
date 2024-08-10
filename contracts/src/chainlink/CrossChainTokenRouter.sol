// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import "./NepathyaPool.sol";
import {SendParam} from "./interface/SendParam.sol";

contract CrossChainTokenRouter {
    /**
     * @dev Struct to hold source and destination pool addresses.
     */
    struct PoolInfo {
        address sourcePool;
        address destinationPool;
    }

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

    // Function to get the PoolInfo
    function getPoolInfo(uint64 destinationSelector, address token) external view returns (PoolInfo memory) {
        return poolTrack[destinationSelector][token];
    }

    /**
     * @dev Function to register and create a new NepathyaPool
     */
    function createAndRegisterPool(uint64 destinationSelector, address token, address linkToken, address routerAddress)
        external
    {

        // Create a new NepathyaPool contract
        NepathyaPool newPool = new NepathyaPool(routerAddress, linkToken, token);

        // Register the newly created pool
        poolTrack[destinationSelector][token] = PoolInfo({sourcePool: address(newPool), destinationPool: address(0)});

        emit PoolRegistered(destinationSelector, token, address(newPool), address(0));
    }

    // Function to bridge tokens

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
        NepathyaPool(poolInfo.sourcePool).sendMessagePayLINK(
            destinationSelector64, poolInfo.destinationPool, SendParam({to: receiver, amount: amount})
        );
    }

    /**
     * @dev Function to update the destination pool for a specific token and chain ID.
     */
    function updateDestinationPool(uint64 destinationSelector, address token, address newDestPool) external {
        PoolInfo storage poolInfo = poolTrack[destinationSelector][token];
        require(poolInfo.sourcePool != address(0), "Source pool not registered");

        address oldDestPool = poolInfo.destinationPool;
        poolInfo.destinationPool = newDestPool;

        emit DestinationPoolUpdated(destinationSelector, token, oldDestPool, newDestPool);
    }
}
