// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import "../src/chainlink/Pool.sol";
import "../src/helpers/Token.sol";

import "../src/chainlink/CrossChainTokenRouter.sol";

contract PoolBaseDeployer is Script {
    Pool pool;

    function run() public {
        // // Load environment variables base sepolia
        address routerAddress = 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93;
        address linkTokenAddress = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;
        address tokenAddress = 0xe7A527BD98566FDc99EA72bf16c6cc4eFe3606a0;

        // Start broadcasting the transaction
        vm.startBroadcast();

        // Deploy the CrossChainTokenRouter
        // CrossChainTokenRouter cctr = new CrossChainTokenRouter();

        pool = new Pool(routerAddress, linkTokenAddress, tokenAddress, PoolOperationMode.TRANSFER_ONLY);

        // Token(linkTokenAddress).transfer(address(cctr), 1 ether);

        // // Create and register a new Pool using the router
        // cctr.createAndRegisterPool(
        //     sourceSelector,
        //     destinationSelector,
        //     ERC20(tokenAddress),
        //     linkTokenAddress,
        //     routerAddress,
        //     receiver,
        //     PoolOperationMode.TRANSFER_ONLY,
        //     PoolOperationMode.BURN_AND_MINT
        // );

        // cctr.updateDestinationPool(destinationSelector, tokenAddress, tokenAddress);

        // // Fetch the newly created pool's address
        // CrossChainTokenRouter.PoolInfo memory poolInfo = cctr.getPoolInfo(destinationSelector, tokenAddress);

        // Token(tokenAddress).approve(address(cctr), 1000000000 ether);

        // Token(linkTokenAddress).transfer(poolInfo.sourcePool, 3 ether);

        // cctr.bridgeToken(tokenAddress, destinationSelector, msg.sender, 10 ether);

        vm.stopBroadcast();
    }
}
