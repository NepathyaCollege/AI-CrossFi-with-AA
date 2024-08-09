// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import {IERC20} from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";

contract MultiTokenKeeper is AutomationCompatibleInterface {
    enum OrderType {
        Buy,
        Sell
    }

    struct Order {
        uint256 id;
        address token;
        address priceFeed;
        OrderType orderType;
        int256 priceThreshold;
        bool isOrderFilled;
        uint256 amount;
    }

    Order[] public orders;

    address public usdtAddress;
    IUniswapV2Router02 public uniswapRouter;
    uint256 public nextOrderId;

    mapping(address => bool) public approvedAggregators;

    constructor(address _uniswapRouter, address _usdtAddress) {
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
        usdtAddress = _usdtAddress;
    }

    event Price(int256 price);
    event TokenPurchased(address token, uint256 amount);
    event TokenSold(address token, uint256 amount);
    event OrderDeleted(uint256 index);
    event OrderProcessed(uint256 orderId);

    function approveAggregator(address aggregator) external {
        approvedAggregators[aggregator] = true;
    }

    function removeAggregator(address aggregator) external {
        approvedAggregators[aggregator] = false;
    }

    function addOrder(address _token, address _priceFeed, OrderType _orderType, int256 _priceThreshold, uint256 _amount)
        external
    {
        require(approvedAggregators[_priceFeed], "Aggregator not approved");

        orders.push(
            Order({
                id: nextOrderId,
                token: _token,
                priceFeed: _priceFeed,
                orderType: _orderType,
                priceThreshold: _priceThreshold,
                isOrderFilled: false,
                amount: _amount
            })
        );

        nextOrderId++;
    }

    function markOrderAsProcessed(uint256 orderId) internal {
        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].id == orderId) {
                orders[i].isOrderFilled = true;
                emit OrderProcessed(orderId);
                break;
            }
        }
    }

    function deleteOrder(uint256 index) external {
        require(index < orders.length, "Order index out of bounds");
        for (uint256 i = index; i < orders.length - 1; i++) {
            orders[i] = orders[i + 1];
        }
        orders.pop();
        emit OrderDeleted(index);
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
        for (uint256 i = 0; i < orders.length; i++) {
            int256 latestPrice = getLatestPrice(orders[i].priceFeed);
            // if (
            //     !orders[i].isOrderFilled
            //         && (
            //             (orders[i].orderType == OrderType.Buy && latestPrice < orders[i].priceThreshold)
            //                 || (orders[i].orderType == OrderType.Sell && latestPrice > orders[i].priceThreshold)
            //         )
            // ) {
            if (!orders[i].isOrderFilled) {
                upkeepNeeded = true;
                performData = abi.encode(orders[i]);
                break;
            }

            // }
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        Order memory order = abi.decode(performData, (Order));
        int256 latestPrice = getLatestPrice(order.priceFeed);

        emit Price(latestPrice);
        if (order.orderType == OrderType.Buy) {
            buyToken(order);
            order.isOrderFilled = true;
        } else if (order.orderType == OrderType.Sell && latestPrice > order.priceThreshold) {
            sellToken(order.token, order.amount);
            order.isOrderFilled = true;
        }

        // if (order.orderType == OrderType.Buy && latestPrice < order.priceThreshold) {

        // } else if (order.orderType == OrderType.Sell && latestPrice > order.priceThreshold) {
        //     sellToken(order.token, order.amount);
        //     order.isOrderFilled = true;
        // }

        // Update the order state
        // for (uint256 i = 0; i < orders.length; i++) {
        //     if (orders[i].token == order.token && orders[i].orderType == order.orderType) {
        //         orders[i] = order;
        //         break;
        //     }
        // }
    }

    function buyToken(Order memory order) internal {
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
            address(this),
            block.timestamp + 15
        );

        markOrderAsProcessed(order.id);

        emit TokenPurchased(token, amount);
    }

    function sellToken(Order memory order) internal {
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
            address(this),
            block.timestamp + 15
        );

        markOrderAsProcessed(order.id);

        emit TokenSold(token, amount);
    }
}
