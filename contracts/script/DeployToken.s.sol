// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
// import "../src/chainlink/helpers/Token.sol";
import "../src/helpers/Token.sol";

contract DeployToken is Script {
    WrappedLink token;

    function run() public {
        vm.startBroadcast();
        // Load environment variables
        token = new WrappedLink();

        // Stop broadcasting the transaction
        vm.stopBroadcast();
    }
}
