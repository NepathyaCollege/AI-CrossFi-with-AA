// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
// import "../src/chainlink/NepathyaPool.sol";
import "../src/chainlink/limitorderkeeper/MultiTokenKeeperFactory.sol";
import "../src/chainlink/limitorderkeeper/MultiTokenKeeper.sol";

import "../src/helpers/Token.sol";

contract DeployMultiTokenKeeperFactory is Script {
    function run() public {
        // Load environment variables
        address routerAddress = 0x1689E7B1F10000AE47eBfE339a4f69dECd19F602;
        address linkTokenAddress = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;
        address tokenAddress = 0x84cEc3F89A0f28803F177575BbF7b2010A62d2Ec;

        address usdt = 0xe7A527BD98566FDc99EA72bf16c6cc4eFe3606a0;
        address aggregatorManager = 0xF7d7F1882d30B3A8d39A3DB46600935096aC5d50;
        address keeperRegistryAddress = 0x80C55e674a34FfE730B0357E16e8852B19573f7C;
        uint256 linkAmount = 3 ether;

        address owner = 0xF2EcFb4b7A57986B5f2432f507FF2432B8057d04;

        // Start broadcasting the transaction
        vm.startBroadcast();

        MultiTokenKeeperFactory multiTokenKeeperFactory = new MultiTokenKeeperFactory(
            routerAddress, usdt, aggregatorManager, keeperRegistryAddress, linkTokenAddress, linkAmount
        );
        Token(linkTokenAddress).transfer(address(multiTokenKeeperFactory), 6 ether);

        // multiTokenKeeperFactory.createAndRegisterMultiTokenKeeper(owner);

        // address keeper = multiTokenKeeperFactory.getMultiTokenKeeper(owner);

        //      // Mint tokens to the MultiTokenKeeper contract
        // Token tokenA = Token(usdt);
        // tokenA.mint(address(keeper), 10000 ether);

        // MultiTokenKeeper(keeper).addOrder(
        //     0x0f5C50184EF3ADF2581fd115A0eB4f3cC7F296A1,
        //     0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298,
        //     OrderManager.OrderType.Buy,
        //     0,
        //     100 ether
        // );

        // Deploy the contract
        // nepathyaPool = NepathyaPool(0x20Fa0Fc715121F50ffe229E0DB1504543d04cEA3); //new NepathyaPool(routerAddress, linkTokenAddress, tokenAddress);
        // // IERC20(linkTokenAddress).transfer(address(nepathyaPool), 1000000000000000000);

        // // IERC20(tokenAddress).approve(address(nepathyaPool), 100000000000000000000000000000000000000);
        // // Token(tokenAddress).mint(0x75998e806D0BE5B37c5DE74AcfA0006B3C7DCdfF, 100000000000000000000000000000000000000);

        // SendParam memory sendParam = SendParam({
        //     to: 0x75998e806D0BE5B37c5DE74AcfA0006B3C7DCdfF, // Replace with actual recipient address
        //     amount: 1000000000 // Replace with actual amount
        // });

        // nepathyaPool.sendMessagePayLINK(16015286601757825753, 0x82edE4BE52222D2EB93E9A23D6fc94645fe06Cc5, sendParam);

        // Stop broadcasting the transaction
        vm.stopBroadcast();
    }
}
