// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import "../src/chainlink/CrossChainTokenRouter.sol";
import "../src/helpers/Token.sol";

contract BaseRouter is Script {
    Pool pool;

    function run() public {
        // Load environment variables

        // Start broadcasting the transaction
        vm.startBroadcast();

        CrossChainTokenRouter cctr = CrossChainTokenRouter(0x3aF31C01444f14F5761b7205685bc92663d5bDfB); //new CrossChainTokenRouter();
        // cctr.registerPool(
        //     16015286601757825753,
        //     0x84cEc3F89A0f28803F177575BbF7b2010A62d2Ec,
        //     0x20Fa0Fc715121F50ffe229E0DB1504543d04cEA3,
        //     0x8B9572E05ee495cd9DDbeBC50b60F6aC3b4eF9dB
        // );

        // address routerAddress = 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93;
        // address linkTokenAddress = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;
        address tokenAddress = 0x84cEc3F89A0f28803F177575BbF7b2010A62d2Ec;

        IERC20(tokenAddress).approve(address(cctr), 1000000000000000000000000000000000000);

        cctr.bridgeToken(
            tokenAddress, 16015286601757825753, 0x75998e806D0BE5B37c5DE74AcfA0006B3C7DCdfF, 10000000000000000000000
        );

        vm.stopBroadcast();
    }
}
