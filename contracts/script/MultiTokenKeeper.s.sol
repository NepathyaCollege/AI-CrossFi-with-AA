// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/chainlink/limitorderkeeper/MutliTokenKeeper.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "../src/helpers/Token.sol";

interface IKeeperRegistry {
    struct RegistrationParams {
        string name;
        bytes encryptedEmail;
        address upkeepContract;
        uint32 gasLimit;
        address adminAddress;
        uint8 triggerType;
        bytes checkData;
        bytes triggerConfig;
        bytes offchainConfig;
        uint96 amount;
    }

    function registerUpkeep(RegistrationParams calldata requestParams) external returns (uint256);
}

contract DeployAndRegisterMultiTokenKeeper is Script {
    function run() external {
        // Configuration parameters
        address usdt = 0x89E7fdbd1EA30300719357A1584C28ee34bcB4bE;
        address uniswapRouterAddress = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f; // Uniswap V2 Router address
        address keeperRegistryAddress = 0xb0E49c5D0d05cbc241d68c05BC5BA1d1B7B72976; // KeeperRegistry address on Sepolia
        address linkTokenAddress = 0x779877A7B0D9E8603169DdbD7836e478b4624789; // LINK token address on Sepolia
        uint256 linkAmount = 3 * 10 ** 18; // 3 LINK
        address aggregatorManagerAddress = 0x14b2fC9e1333F30d70E1672D1859a08E8082384D;

        // Start broadcast
        vm.startBroadcast();

        // Deploy the MultiTokenKeeper contract
        MultiTokenKeeper multiTokenKeeper = new MultiTokenKeeper(uniswapRouterAddress, usdt, aggregatorManagerAddress);

        // Mint tokens to the MultiTokenKeeper contract
        Token tokenA = Token(usdt);
        tokenA.mint(address(multiTokenKeeper), 10000 ether);

        // Add an order to the MultiTokenKeeper
        // multiTokenKeeper.addOrder(recipient, oracle, OrderManager.OrderType.Buy, 0, 100 ether);

        multiTokenKeeper.addOrder(
            0x3aF31C01444f14F5761b7205685bc92663d5bDfB,
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43,
            OrderManager.OrderType.Buy,
            0,
            100 ether
        );

        Token(linkTokenAddress).approve(keeperRegistryAddress, linkAmount);
        // Register the MultiTokenKeeper contract with the KeeperRegistry
        IKeeperRegistry keeperRegistry = IKeeperRegistry(keeperRegistryAddress);
        IKeeperRegistry.RegistrationParams memory params = IKeeperRegistry.RegistrationParams({
            name: "MultiTokenKeeper Upkeep",
            encryptedEmail: "",
            upkeepContract: address(multiTokenKeeper),
            gasLimit: 500000,
            adminAddress: msg.sender,
            triggerType: 0, // Example trigger type
            checkData: "",
            triggerConfig: "",
            offchainConfig: "",
            amount: uint96(linkAmount)
        });
        uint256 upkeepId = keeperRegistry.registerUpkeep(params);

        // Fund the upkeep with LINK
        // LinkTokenInterface linkToken = LinkTokenInterface(linkTokenAddress);
        // linkToken.transferAndCall(keeperRegistryAddress, linkAmount, abi.encode(upkeepId));

        // Stop broadcast
        vm.stopBroadcast();

        // Log deployment details
        console.log("MultiTokenKeeper deployed to:", address(multiTokenKeeper));
        console.log("Upkeep registered with ID:", upkeepId);
        console.log("Deposited LINK amount:", linkAmount);
    }
}
