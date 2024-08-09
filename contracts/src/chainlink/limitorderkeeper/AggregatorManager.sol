// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AggregatorManager is Ownable {
    mapping(address => bool) public approvedAggregators;

    constructor() Ownable(msg.sender) {}

    function approveAggregator(address aggregator) external onlyOwner {
        approvedAggregators[aggregator] = true;
    }

    function removeAggregator(address aggregator) external onlyOwner {
        approvedAggregators[aggregator] = false;
    }

    function isAggregatorApproved(address aggregator) external view returns (bool) {
        return approvedAggregators[aggregator];
    }
}
