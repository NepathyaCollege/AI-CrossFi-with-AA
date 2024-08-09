// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "../src/chainlink/Router.sol";
import "../src/chainlink/limitorderkeeper/AggregatorManager.sol";
import {Script, console} from "forge-std/Script.sol";

contract AggregatorManagerDeployer is Script {
    AggregatorManager public aggregatorManager;

    function run() public {
        vm.startBroadcast();
        aggregatorManager = new AggregatorManager();
        aggregatorManager.approveAggregator(0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298);

        aggregatorManager.approveAggregator(0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1);
        aggregatorManager.approveAggregator(0xb113F5A928BCfF189C998ab20d753a47F9dE5A61);

        vm.stopBroadcast();
    }
}
//forge verify-contract 0x14b2fC9e1333F30d70E1672D1859a08E8082384D src/chainlink/limitorderkeeper/AggregatorManager.sol:AggregatorManager --etherscan-api-key EDIZBUAS4TG4RRM7VC4VVSIU19ESG6CCHP  --chain-id 11155111
