// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "lib/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "../src/helpers/Token.sol";

contract CreateLiquidity is Script {
    address private constant UNISWAP_V2_ROUTER = 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008; // Replace with actual address
    //usdt
    address private constant TOKEN_A = address(0x89E7fdbd1EA30300719357A1584C28ee34bcB4bE); // Replace with actual address
    address private constant TOKEN_B = 0x3aF31C01444f14F5761b7205685bc92663d5bDfB; // Replace with actual address

    uint256 private constant AMOUNT_A = 1000000000000000 ether; // Replace with actual amount
    uint256 private constant AMOUNT_B = 500000000000 ether; // Replace with actual amount

    function run() external {
        vm.startBroadcast();

        Token tokenA = Token(TOKEN_A);
        Token tokenB = Token(TOKEN_B);
        IUniswapV2Router02 router = IUniswapV2Router02(UNISWAP_V2_ROUTER);

        tokenA.mint(msg.sender, AMOUNT_A);
        // Approve the router to spend tokens
        require(tokenA.approve(address(router), AMOUNT_A), "Token A approval failed");
        require(tokenB.approve(address(router), AMOUNT_B), "Token B approval failed");

        // Add liquidity
        router.addLiquidity(
            TOKEN_A,
            TOKEN_B,
            AMOUNT_A,
            AMOUNT_B,
            0, // Minimum amount of Token A to add
            0, // Minimum amount of Token B to add
            msg.sender, // Recipient of liquidity tokens
            block.timestamp + 15 minutes // Deadline
        );

        vm.stopBroadcast();
    }
}
