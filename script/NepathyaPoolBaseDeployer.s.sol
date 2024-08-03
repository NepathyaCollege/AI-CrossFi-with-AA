// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import "../src/chainlink/NepathyaPool.sol";
import {IERC20} from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import "../src/helpers/Token.sol";

contract NepathyaPoolBaseDeployer is Script {
    NepathyaPool nepathyaPool;

    function run() public {
        // Load environment variables
        address routerAddress = 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93;
        address linkTokenAddress = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;
        address tokenAddress = 0xBC94f202B09D2BE84fB599Dd97848Bb52b7A753C;

        // Start broadcasting the transaction
        vm.startBroadcast();

        // Deploy the contract
        nepathyaPool = new NepathyaPool(routerAddress, linkTokenAddress, tokenAddress);
        IERC20(linkTokenAddress).transfer(address(nepathyaPool), 1000000000000000000);

        IERC20(tokenAddress).approve(address(nepathyaPool), 100000000000000000000000000000000000000);
        Token(tokenAddress).mint(0x75998e806D0BE5B37c5DE74AcfA0006B3C7DCdfF, 100000000000000000000000000000000000000);

        SendParam memory sendParam = SendParam({
            to: 0x5E6E79109C3Df8FA071889CD2cDa3627f8d97606, // Replace with actual recipient address
            amount: 1000 // Replace with actual amount
        });

        nepathyaPool.sendMessagePayLINK(16015286601757825753, 0x75998e806D0BE5B37c5DE74AcfA0006B3C7DCdfF, sendParam);

        // Stop broadcasting the transaction
        vm.stopBroadcast();
    }
}
