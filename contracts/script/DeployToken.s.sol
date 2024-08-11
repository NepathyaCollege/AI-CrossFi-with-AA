// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
// import "../src/chainlink/helpers/Token.sol";
import "../src/helpers/Token.sol";

contract DeployToken is Script {
    Token token;

    function run() public {
        vm.startBroadcast();
        // Load environment variables
        token = Token(0x1689E7B1F10000AE47eBfE339a4f69dECd19F602);

        // Token token = new Token("USDT", "USDT", 18);

        // Stop broadcasting the transaction
        vm.stopBroadcast();
    }
}
