// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import "../src/chainlink/Pool.sol";
import "../src/helpers/Token.sol";

import "../src/chainlink/CrossChainTokenRouter.sol";

contract PoolSepoliaDeployer is Script {
    Pool pool;

    function run() public {
        // Load environment variables
        address routerAddress = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;
        address linkTokenAddress = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
        address tokenAddress = 0xBE9A39C775073A71dF550678f22a07B3201f26fC;

        // Start broadcasting the transaction
        vm.startBroadcast();

        // Deploy the contract
        // Pool = Pool(0x5E6E79109C3Df8FA071889CD2cDa3627f8d97606); // new Pool(routerAddress, linkTokenAddress);
        pool = new Pool(routerAddress, linkTokenAddress, tokenAddress, PoolOperationMode.BURN_AND_MINT);

        // CrossChainTokenRouter cctr = new CrossChainTokenRouter();

        // Token(tokenAddress).mint(address(pool), 1000000000000000000000000000000000000000000);
        // SendParam memory testSendParam = Pool.testSendParam;
        // console.log(testSendParam.amount);

        // Stop broadcasting the transaction
        vm.stopBroadcast();
    }
}
