// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import "../src/chainlink/NepathyaPool.sol";
import "../src/helpers/Token.sol";

contract NepathyaPoolBaseDeployer is Script {
    NepathyaPool nepathyaPool;

    function run() public {
        // Load environment variables
        address routerAddress = 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93;
        address linkTokenAddress = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;
        address tokenAddress = 0x84cEc3F89A0f28803F177575BbF7b2010A62d2Ec;

        // Start broadcasting the transaction
        vm.startBroadcast();

        // Deploy the contract
        nepathyaPool = NepathyaPool(0x20Fa0Fc715121F50ffe229E0DB1504543d04cEA3); //new NepathyaPool(routerAddress, linkTokenAddress, tokenAddress);
        // IERC20(linkTokenAddress).transfer(address(nepathyaPool), 1000000000000000000);

        // IERC20(tokenAddress).approve(address(nepathyaPool), 100000000000000000000000000000000000000);
        // Token(tokenAddress).mint(0x75998e806D0BE5B37c5DE74AcfA0006B3C7DCdfF, 100000000000000000000000000000000000000);

        SendParam memory sendParam = SendParam({
            to: 0x75998e806D0BE5B37c5DE74AcfA0006B3C7DCdfF, // Replace with actual recipient address
            amount: 1000000000 // Replace with actual amount
        });

        nepathyaPool.sendMessagePayLINK(16015286601757825753, 0x82edE4BE52222D2EB93E9A23D6fc94645fe06Cc5, sendParam);

        // Stop broadcasting the transaction
        vm.stopBroadcast();
    }
}
