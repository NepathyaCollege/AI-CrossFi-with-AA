// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
// import "../src/MultiTokenKeeper.sol";
import "../src/chainlink/limitorderkeeper/MutliTokenKeeper.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

interface IKeeperRegistry {
    function registerUpkeep(address target, uint32 gasLimit, address admin, bytes calldata checkData)
        external
        returns (uint256);

    function registerUpkeep(
        address target,
        uint32 gasLimit,
        address admin,
        bytes calldata checkData,
        bytes calldata triggerConfig,
        bytes calldata offchainConfig
    ) external returns (uint256);
}

contract DeployAndRegisterMultiTokenKeeper is Script {
    function run() external {
        address uniswapRouterAddress = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f; // Uniswap V2 Router address
        address keeperRegistryAddress = 0x86EFBD0b6736Bed994962f9797049422A3A8E8Ad; // Replace with actual KeeperRegistry address on Sepolia
        address linkTokenAddress = 0x779877A7B0D9E8603169DdbD7836e478b4624789; // Replace with actual LINK token address on Sepolia
        uint256 linkAmount = 3 * 10 ** 18; // Amount of LINK to deposit (10 LINK)

        vm.startBroadcast();

        // Deploy the MultiTokenKeeper contract
        MultiTokenKeeper multiTokenKeeper = new MultiTokenKeeper();

        // Register the contract with the KeeperRegistry
        // IKeeperRegistry keeperRegistry = IKeeperRegistry(keeperRegistryAddress);
        // uint256 upkeepId = keeperRegistry.registerUpkeep(
        //     address(multiTokenKeeper),
        //     600000,    // Gas limit for the upkeep
        //     msg.sender,  // Address to receive upkeep funds
        //     ""  // Check data, can be left empty
        // );

        // // Fund the upkeep with LINK
        // LinkTokenInterface linkToken = LinkTokenInterface(linkTokenAddress);
        // linkToken.transferAndCall(keeperRegistryAddress, linkAmount, abi.encode(upkeepId));

        // vm.stopBroadcast();

        console.log("MultiTokenKeeper deployed to:", address(multiTokenKeeper));
        // console.log("Upkeep registered with ID:", upkeepId);
        console.log("Deposited LINK amount:", linkAmount);
    }
}
