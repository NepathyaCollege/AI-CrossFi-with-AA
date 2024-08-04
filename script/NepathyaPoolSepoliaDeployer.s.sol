// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import "../src/chainlink/NepathyaPool.sol";
import "../src/helpers/Token.sol";

contract NepathyaPoolSepoliaDeployer is Script {
    NepathyaPool nepathyaPool;

    function run() public {
        // Load environment variables
        address routerAddress = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;
        address linkTokenAddress = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
        address tokenAddress = 0x7013F03df627CBa867d6892beCE4126D2FC0c35e;

        // Start broadcasting the transaction
        vm.startBroadcast();

        // Deploy the contract
        // nepathyaPool = NepathyaPool(0x5E6E79109C3Df8FA071889CD2cDa3627f8d97606); // new NepathyaPool(routerAddress, linkTokenAddress);
        nepathyaPool = new NepathyaPool(routerAddress, linkTokenAddress, tokenAddress);

        Token(tokenAddress).mint(address(nepathyaPool), 1000000000000000000000000000000000000000000);
        // SendParam memory testSendParam = nepathyaPool.testSendParam;
        // console.log(testSendParam.amount);

        // Stop broadcasting the transaction
        vm.stopBroadcast();
    }
}
