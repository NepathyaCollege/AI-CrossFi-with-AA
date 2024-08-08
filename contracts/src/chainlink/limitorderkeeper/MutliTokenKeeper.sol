// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract MultiTokenKeeper is AutomationCompatibleInterface {
    enum OrderType {
        Buy,
        Sell
    }

    struct Order {
        address token;
        address priceFeed;
        OrderType orderType;
        int256 priceThreshold;
        bool isOrderFilled;
        uint256 amount;
    }

    Order[] public orders;

    event Price(int256 price);
    event TokenPurchased(address token, uint256 amount);
    event TokenSold(address token, uint256 amount);

    function addOrder(address _token, address _priceFeed, OrderType _orderType, int256 _priceThreshold, uint256 _amount)
        external
    {
        for (uint256 i = 0; i < orders.length; i++) {
            require(
                orders[i].token != _token || orders[i].orderType != _orderType,
                "Order for this token and order type already exists"
            );
        }
        orders.push(
            Order({
                token: _token,
                priceFeed: _priceFeed,
                orderType: _orderType,
                priceThreshold: _priceThreshold,
                isOrderFilled: false,
                amount: _amount
            })
        );
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
            if (
                !orders[i].isOrderFilled
                    && (
                        (orders[i].orderType == OrderType.Buy && latestPrice < orders[i].priceThreshold)
                            || (orders[i].orderType == OrderType.Sell && latestPrice > orders[i].priceThreshold)
                    )
            ) {
                upkeepNeeded = true;
                performData = abi.encode(orders[i]);
                break;
            }
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        Order memory order = abi.decode(performData, (Order));
        int256 latestPrice = getLatestPrice(order.priceFeed);

        emit Price(latestPrice);
        if (order.orderType == OrderType.Buy && latestPrice < order.priceThreshold) {
            buyToken(order.token, order.amount);
            order.isOrderFilled = true;
        } else if (order.orderType == OrderType.Sell && latestPrice > order.priceThreshold) {
            sellToken(order.token, order.amount);
            order.isOrderFilled = true;
        }

        // Update the order state
        for (uint256 i = 0; i < orders.length; i++) {
            if (orders[i].token == order.token && orders[i].orderType == order.orderType) {
                orders[i] = order;
                break;
            }
        }
    }

    function buyToken(address token, uint256 amount) internal {
        // Logic to buy the token goes here
        // This is a placeholder function and needs implementation based on the token contract
    }

    function sellToken(address token, uint256 amount) internal {
        // Logic to sell the token goes here
        // This is a placeholder function and needs implementation based on the token contract
        emit TokenSold(token, amount);
    }
}
