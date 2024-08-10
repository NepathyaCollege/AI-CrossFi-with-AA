// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "../src/chainlink/Router.sol";
import "../src/chainlink/limitorderkeeper/AggregatorManager.sol";
import {Script, console} from "forge-std/Script.sol";

contract BaseRouterDeployer is Script {
    function run() public {
        vm.startBroadcast();

        vm.stopBroadcast();
    }
}
//forge verify-contract 0x14b2fC9e1333F30d70E1672D1859a08E8082384D src/chainlink/limitorderkeeper/AggregatorManager.sol:AggregatorManager --etherscan-api-key EDIZBUAS4TG4RRM7VC4VVSIU19ESG6CCHP  --chain-id 11155111
