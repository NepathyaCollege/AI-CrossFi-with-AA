// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import "./NepathyaPool.sol";
import "lib/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

enum OperationType {
    SWAP_ON_CHAIN,
    SWAP_AND_BRIDGE,
    BRIDGE_ONLY
}

struct PoolInfo {
    address sourcePool;
    address destinationPool;
}

contract Router {
    address public uniswapRouter;

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

    event SwapExecuted(
        address indexed user, address indexed fromToken, address indexed toToken, uint256 amountIn, uint256 amountOut
    );
    event BridgeExecuted(address indexed user, address indexed token, uint64 chainId, address receiver, uint256 amount);

    constructor(address _uniswapRouter) {
        uniswapRouter = _uniswapRouter;
    }

    function _swapTokensOnChain(
        address fromToken,
        address toToken,
        uint256 amountIn,
        uint256 amountOutMin,
        address receiver
    ) private {
        IERC20(fromToken).approve(uniswapRouter, amountIn);

        address[] memory path = new address[](2);
        path[0] = fromToken;
        path[1] = toToken;

        uint256[] memory amounts = IUniswapV2Router02(uniswapRouter).swapExactTokensForTokens(
            amountIn, amountOutMin, path, receiver, block.timestamp
        );

        emit SwapExecuted(msg.sender, fromToken, toToken, amountIn, amounts[1]);
    }

    function _swapAndBridgeTokens(
        address fromToken,
        address toToken,
        uint256 amountIn,
        uint256 amountOutMin,
        uint64 chainId,
        address receiver,
        address sourcePool,
        address destPool
    ) private {
        IERC20(fromToken).approve(uniswapRouter, amountIn);

        address[] memory path = new address[](2);
        path[0] = fromToken;
        path[1] = toToken;

        uint256[] memory amounts = IUniswapV2Router02(uniswapRouter).swapExactTokensForTokens(
            amountIn, amountOutMin, path, address(this), block.timestamp + 500
        );

        uint256 amountOut = amounts[1];

        IERC20(toToken).approve(sourcePool, amountOut);

        NepathyaPool(sourcePool).sendMessagePayLINK(chainId, destPool, SendParam({to: receiver, amount: amountOut}));

        emit SwapExecuted(msg.sender, fromToken, toToken, amountIn, amountOut);
        emit BridgeExecuted(msg.sender, toToken, chainId, receiver, amountOut);
    }

    function _bridgeTokens(address tokenAddress, uint64 chainId, address receiver, uint256 amount) private {
        PoolInfo memory poolInfo = poolTrack[chainId][tokenAddress];
        require(poolInfo.destinationPool != address(0), "Destination pool not registered");

        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);

        IERC20(tokenAddress).approve(poolInfo.sourcePool, amount);

        // Call the sendMessagePayLINK function on the source pool
        NepathyaPool(poolInfo.sourcePool).sendMessagePayLINK(
            chainId, poolInfo.destinationPool, SendParam({to: receiver, amount: amount})
        );

        emit BridgeExecuted(msg.sender, tokenAddress, chainId, receiver, amount);
    }

    function execute(
        OperationType operationType,
        address fromToken,
        address toToken,
        uint256 amountIn,
        uint256 amountOutMin,
        uint64 chainId,
        address receiver,
        address sourcePool,
        address destPool
    ) external payable {
        if (fromToken == address(0)) {
            // Native token case
            require(msg.value == amountIn, "Incorrect amount of native token sent");
        } else {
            require(IERC20(fromToken).transferFrom(msg.sender, address(this), amountIn), "Transfer failed");
        }
        if (operationType == OperationType.SWAP_ON_CHAIN) {
            _swapTokensOnChain(fromToken, toToken, amountIn, amountOutMin, receiver);
        } else if (operationType == OperationType.SWAP_AND_BRIDGE) {
            // _swapAndBridgeTokens(fromToken, toToken, amountIn, amountOutMin, chainId, receiver, sourcePool, destPool);
        } else if (operationType == OperationType.BRIDGE_ONLY) {
            _bridgeTokens(fromToken, chainId, receiver, amountIn);
        }
    }
}
