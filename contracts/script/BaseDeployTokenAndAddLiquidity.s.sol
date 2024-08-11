// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/chainlink/Router.sol";
import {Script, console} from "forge-std/Script.sol";
import "lib/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "../src/helpers/Token.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "../src/chainlink/Router.sol";

contract BaseDeployTokenAndAddLiquidity is Script {
    Token public token;
    IUniswapV2Router02 public uniswapRouter;
    address public WETH;

    function run() public {
        vm.startBroadcast();
        // Set the Uniswap V2 Router address and WETH address
        bridgeToken();
        vm.stopBroadcast();
    }

    function bridgeToken() private {
        address tokenAddress = 0x84cEc3F89A0f28803F177575BbF7b2010A62d2Ec;
        uniswapRouter = IUniswapV2Router02(0x1689E7B1F10000AE47eBfE339a4f69dECd19F602);

        Router router = new Router(address(uniswapRouter));

        //  chainId,tokenaddress, sourcepool,destinationpool
        router.registerPool(
            16015286601757825753,
            0x84cEc3F89A0f28803F177575BbF7b2010A62d2Ec,
            0x20Fa0Fc715121F50ffe229E0DB1504543d04cEA3,
            0x8B9572E05ee495cd9DDbeBC50b60F6aC3b4eF9dB
        );

        IERC20(tokenAddress).approve(address(router), 100000000000000000000000000000000000000);
        router.execute(
            OperationType.BRIDGE_ONLY,
            address(tokenAddress),
            address(0), // toToken is not used for BRIDGE_ONLY
            50 ether,
            0, // amountOutMin is not used for BRIDGE_ONLY
            16015286601757825753, // Example chainId
            msg.sender,
            address(0), // Replace with actual source pool address
            address(0) // Replace with actual destination pool address
        );
    }

    function swapToken() private {
        uniswapRouter = IUniswapV2Router02(0x1689E7B1F10000AE47eBfE339a4f69dECd19F602);
        WETH = uniswapRouter.WETH();
        console.log(address(WETH));

        // Start broadcasting transactions

        // Deploy the token
        token = Token(0x1689E7B1F10000AE47eBfE339a4f69dECd19F602); //new Token();

        // Mint some tokens for the sender
        token.mint(msg.sender, 1000 ether);

        // Approve the Uniswap router to spend the tokens
        IERC20(address(token)).approve(address(uniswapRouter), 500 ether);
        IERC20(WETH).approve(address(uniswapRouter), 1 ether);

        // Add liquidity to the Uniswap V2 pair
        uniswapRouter.addLiquidityETH{value: 0.001 ether}(
            address(token), 500 ether, 0, 0, msg.sender, block.timestamp + 500
        );

        Router router = new Router(address(uniswapRouter));

        // router = new CrossChainTokenRouter(uniswapRouter);

        // Mint some tokens for the deployer
        token.mint(msg.sender, 1000 ether);

        // Approve the router to spend the tokens
        IERC20(address(token)).approve(address(router), 500 ether);

        // Execute the swap
        router.execute(
            OperationType.SWAP_ON_CHAIN,
            address(token),
            WETH,
            10 ether,
            0,
            0, // chainId is not used for SWAP_ON_CHAIN
            msg.sender,
            address(0), // sourcePool is not used for SWAP_ON_CHAIN
            address(0) // destPool is not used for SWAP_ON_CHAIN
        );
    }
}
