// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OrderManager {
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
        uint256 amount;
    }

    Order[] public activeOrders;
    Order[] public fulfilledOrders;
    uint256 public nextOrderId;

    event OrderCreated(uint256 orderId, address token, OrderType orderType);
    event OrderProcessed(uint256 orderId);
    event OrderCanceled(uint256 orderId);

    function addOrder(address _token, address _priceFeed, OrderType _orderType, int256 _priceThreshold, uint256 _amount)
        external
        returns (uint256)
    {
        activeOrders.push(
            Order({
                id: nextOrderId,
                token: _token,
                priceFeed: _priceFeed,
                orderType: _orderType,
                priceThreshold: _priceThreshold,
                amount: _amount
            })
        );

        emit OrderCreated(nextOrderId, _token, _orderType);
        return nextOrderId++;
    }

    function markOrderAsProcessed(uint256 orderId) external {
        for (uint256 i = 0; i < activeOrders.length; i++) {
            if (activeOrders[i].id == orderId) {
                // Move the order to fulfilledOrders
                fulfilledOrders.push(activeOrders[i]);

                // Remove the order from activeOrders
                _removeActiveOrder(i);

                emit OrderProcessed(orderId);
                break;
            }
        }
    }

    function cancelOrder(uint256 orderId) external {
        for (uint256 i = 0; i < activeOrders.length; i++) {
            if (activeOrders[i].id == orderId) {
                _removeActiveOrder(i);
                emit OrderCanceled(orderId);
                break;
            }
        }
    }

    function _removeActiveOrder(uint256 index) internal {
        require(index < activeOrders.length, "Order index out of bounds");
        activeOrders[index] = activeOrders[activeOrders.length - 1];
        activeOrders.pop();
    }

    function getActiveOrders() external view returns (Order[] memory) {
        return activeOrders;
    }

    function getFulfilledOrders() external view returns (Order[] memory) {
        return fulfilledOrders;
    }

    function getOrder(uint256 orderId) external view returns (Order memory order, bool isActive) {
        for (uint256 i = 0; i < activeOrders.length; i++) {
            if (activeOrders[i].id == orderId) {
                return (activeOrders[i], true);
            }
        }
        for (uint256 i = 0; i < fulfilledOrders.length; i++) {
            if (fulfilledOrders[i].id == orderId) {
                return (fulfilledOrders[i], false);
            }
        }
        revert("Order not found");
    }
}
