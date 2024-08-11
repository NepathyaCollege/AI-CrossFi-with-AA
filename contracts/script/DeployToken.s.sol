// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
// import "../src/chainlink/helpers/Token.sol";
import "../src/helpers/USDT.sol";

contract DeployToken is Script {
    USDT token;

    function run() public {
        vm.startBroadcast();
        // Load environment variables
        token = new USDT();

        // Token token = new Token("USDT", "USDT", 18);

        // Stop broadcasting the transaction
        vm.stopBroadcast();
    }
}
