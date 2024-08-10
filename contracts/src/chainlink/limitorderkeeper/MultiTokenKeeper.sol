// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import {IERC20} from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import "./AggregatorManager.sol";
import "./OrderManager.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiTokenKeeper is AutomationCompatibleInterface, Ownable {
    AggregatorManager public aggregatorManager;
    OrderManager public orderManager;

    address public usdtAddress;
    IUniswapV2Router02 public uniswapRouter;

    constructor(address _uniswapRouter, address _usdtAddress, address _aggregatorManager, address owner)
        Ownable(owner)
    {
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
        usdtAddress = _usdtAddress;
        aggregatorManager = AggregatorManager(_aggregatorManager);
        orderManager = new OrderManager(address(this));
    }

    event Price(int256 price);
    event TokenPurchased(address token, uint256 amount);
    event TokenSold(address token, uint256 amount);

    function addOrder(
        address _token,
        address _priceFeed,
        OrderManager.OrderType _orderType,
        int256 _priceThreshold,
        uint256 _amount
    ) external onlyOwner {
        require(aggregatorManager.isAggregatorApproved(_priceFeed), "Aggregator not approved");

        if (_orderType == OrderManager.OrderType.Buy) {
            IERC20(usdtAddress).transferFrom(msg.sender, address(this), _amount);
        } else {
            IERC20(_token).transferFrom(msg.sender,address(this), _amount);
        }

        // if()

        orderManager.addOrder(_token, _priceFeed, _orderType, _priceThreshold, _amount);
    }

    function getLatestPrice(address priceFeed) public view returns (int256) {
        (, int256 price,,,) = AggregatorV3Interface(priceFeed).latestRoundData();
        return price;
    }

    function checkUpkeep(bytes calldata checkData)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = false;
        OrderManager.Order[] memory activeOrders = orderManager.getActiveOrders();
        for (uint256 i = 0; i < activeOrders.length; i++) {
            int256 latestPrice = getLatestPrice(activeOrders[i].priceFeed);
            // if (
            //     // (
            //         activeOrders[i].orderType == OrderManager.OrderType.Buy
            //             // && latestPrice < activeOrders[i].priceThreshold
            //     // )
            //         // || (
            //         //     activeOrders[i].orderType == OrderManager.OrderType.Sell
            //         //         && latestPrice > activeOrders[i].priceThreshold
            //         // )
            // ) {
            upkeepNeeded = true;
            performData = abi.encode(activeOrders[i]);
            break;
            // }
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        OrderManager.Order memory order = abi.decode(performData, (OrderManager.Order));
        int256 latestPrice = getLatestPrice(order.priceFeed);

        emit Price(latestPrice);
        if (order.orderType == OrderManager.OrderType.Buy) {
            buyToken(order);
        } else if (order.orderType == OrderManager.OrderType.Sell) {
            sellToken(order);
        }

        orderManager.markOrderAsProcessed(order.id);
    }

    function buyToken(OrderManager.Order memory order) internal {
        address token = order.token;
        uint256 amount = order.amount;

        address[] memory pair = new address[](2);
        pair[0] = usdtAddress;
        pair[1] = token;

        IERC20(usdtAddress).approve(address(uniswapRouter), amount);

        uniswapRouter.swapExactTokensForTokens(
            amount,
            0, // Accept any amount of token
            pair,
            owner(),
            block.timestamp + 15
        );

        emit TokenPurchased(token, amount);
    }

    function sellToken(OrderManager.Order memory order) internal {
        address token = order.token;
        uint256 amount = order.amount;

        address[] memory pair = new address[](2);
        pair[0] = token;
        pair[1] = usdtAddress;

        IERC20(token).approve(address(uniswapRouter), amount);

        uniswapRouter.swapExactTokensForTokens(
            amount,
            0, // Accept any amount of USDT
            pair,
            owner(),
            block.timestamp + 15
        );

        emit TokenSold(token, amount);
    }
}
