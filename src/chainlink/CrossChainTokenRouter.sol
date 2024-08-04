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
    event PoolRegistered(uint64 chainId, address token, address sourcePool, address destPool);

    // Function to get the PoolInfo
    function getPoolInfo(uint64 chainId, address token) external view returns (PoolInfo memory) {
        return poolTrack[chainId][token];
    }

    // Function to register a pool
    function registerPool(uint64 chainId, address token, address sourcePool, address destPool) external {
        poolTrack[chainId][token] = PoolInfo({sourcePool: sourcePool, destinationPool: destPool});
        emit PoolRegistered(chainId, token, sourcePool, destPool);
    }

    // Function to bridge tokens
    function bridgeToken(address tokenAddress, uint64 chainId, address receiver, uint256 amount) external {
        PoolInfo memory poolInfo = poolTrack[chainId][tokenAddress];
        require(poolInfo.destinationPool != address(0), "Destination pool not registered");

        // Transfer tokens to the source pool

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);

        IERC20(tokenAddress).approve(poolInfo.sourcePool, amount);

        // Call the sendMessagePayLINK function on the source pool
        NepathyaPool(poolInfo.sourcePool).sendMessagePayLINK(
            chainId, poolInfo.destinationPool, SendParam({to: receiver, amount: amount})
        );
    }
}
