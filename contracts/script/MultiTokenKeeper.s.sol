// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
// import "../src/MultiTokenKeeper.sol";
import "../src/chainlink/limitorderkeeper/MutliTokenKeeper.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "../src/helpers/Token.sol";

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
        address usdt = 0x89E7fdbd1EA30300719357A1584C28ee34bcB4bE;
        address uniswapRouterAddress = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f; // Uniswap V2 Router address
        address keeperRegistryAddress = 0x86EFBD0b6736Bed994962f9797049422A3A8E8Ad; // Replace with actual KeeperRegistry address on Sepolia
        address linkTokenAddress = 0x779877A7B0D9E8603169DdbD7836e478b4624789; // Replace with actual LINK token address on Sepolia
        uint256 linkAmount = 3 * 10 ** 18; // Amount of LINK to deposit (10 LINK)

        Token tokenA = Token(usdt);

        address UNISWAP_V2_ROUTER = 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008; // Replace with actual address

        vm.startBroadcast();

        MultiTokenKeeper multiTokenKeeper = MultiTokenKeeper(0x0D5Fa506452EAd3BbF5f8A1639866cA50e5a3888); //new MultiTokenKeeper(UNISWAP_V2_ROUTER, usdt);

        // Deploy the MultiTokenKeeper contract
        // MultiTokenKeeper multiTokenKeeper = new MultiTokenKeeper(UNISWAP_V2_ROUTER, usdt);

        multiTokenKeeper.approveAggregator(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43);

        tokenA.mint(address(multiTokenKeeper), 10000 ether);

        multiTokenKeeper.addOrder(
            0x3aF31C01444f14F5761b7205685bc92663d5bDfB,
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43,
            MultiTokenKeeper.OrderType.Buy,
            0,
            100 ether
        );

        // multiTokenKeeper.buyToken(0x7E29ee6eE5Ed4195C797B06f20b0a500eA30a79C, 100 ether);

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
