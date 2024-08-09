export const orderManagerAbi = [
    {
        "type": "function",
        "name": "activeOrders",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "id",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "priceFeed",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "orderType",
                "type": "uint8",
                "internalType": "enum OrderManager.OrderType"
            },
            {
                "name": "priceThreshold",
                "type": "int256",
                "internalType": "int256"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "addOrder",
        "inputs": [
            {
                "name": "_token",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_priceFeed",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_orderType",
                "type": "uint8",
                "internalType": "enum OrderManager.OrderType"
            },
            {
                "name": "_priceThreshold",
                "type": "int256",
                "internalType": "int256"
            },
            {
                "name": "_amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "cancelOrder",
        "inputs": [
            {
                "name": "orderId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "fulfilledOrders",
        "inputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "id",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "priceFeed",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "orderType",
                "type": "uint8",
                "internalType": "enum OrderManager.OrderType"
            },
            {
                "name": "priceThreshold",
                "type": "int256",
                "internalType": "int256"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getActiveOrders",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple[]",
                "internalType": "struct OrderManager.Order[]",
                "components": [
                    {
                        "name": "id",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "priceFeed",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "orderType",
                        "type": "uint8",
                        "internalType": "enum OrderManager.OrderType"
                    },
                    {
                        "name": "priceThreshold",
                        "type": "int256",
                        "internalType": "int256"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getFulfilledOrders",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple[]",
                "internalType": "struct OrderManager.Order[]",
                "components": [
                    {
                        "name": "id",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "priceFeed",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "orderType",
                        "type": "uint8",
                        "internalType": "enum OrderManager.OrderType"
                    },
                    {
                        "name": "priceThreshold",
                        "type": "int256",
                        "internalType": "int256"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getOrder",
        "inputs": [
            {
                "name": "orderId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "order",
                "type": "tuple",
                "internalType": "struct OrderManager.Order",
                "components": [
                    {
                        "name": "id",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "priceFeed",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "orderType",
                        "type": "uint8",
                        "internalType": "enum OrderManager.OrderType"
                    },
                    {
                        "name": "priceThreshold",
                        "type": "int256",
                        "internalType": "int256"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "name": "isActive",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "markOrderAsProcessed",
        "inputs": [
            {
                "name": "orderId",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "nextOrderId",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "OrderCanceled",
        "inputs": [
            {
                "name": "orderId",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OrderCreated",
        "inputs": [
            {
                "name": "orderId",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            },
            {
                "name": "token",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "orderType",
                "type": "uint8",
                "indexed": false,
                "internalType": "enum OrderManager.OrderType"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "OrderProcessed",
        "inputs": [
            {
                "name": "orderId",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    }
]