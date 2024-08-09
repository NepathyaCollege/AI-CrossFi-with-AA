
import { getContract, prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { multiTokenKeeperAbi } from "./abis/multiTokenKeeperAbi";

export const addOrderOnMultiKeeper = async ({
    smartAccount,
    client,
    chain,
    contractAddress
}: any): Promise<string> => {
    const contract = getContract({
        client,
        chain,
        address: contractAddress,
        abi: multiTokenKeeperAbi as any,
    });
    // This method will add an order to the contract with the specified parameters.
    // 
    // params:
    // - tokenAddress (string): The address of the token that the order is for.
    // - chainlinkAggregatorAddress (string): The address of the Chainlink aggregator used to fetch price data for the order.
    // - orderType (number): The type of order, where 0 indicates a buy order and 1 indicates a sell order.
    // - priceThreshold (number): The target price at which to execute the order. For a buy order, this would be the maximum price; for a sell order, the minimum price.
    // - amountToBuy (string): The amount of the token to buy, specified in its smallest unit (e.g., wei for ETH).
    const transaction = await prepareContractCall({
        contract,
        method: "addOrder",
        params: [
            "0x0f5C50184EF3ADF2581fd115A0eB4f3cC7F296A1",  // Token address
            "0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298",  // Chainlink aggregator address
            0,  // Order type (0 for buy, 1 for sell)
            0,  // Price threshold (target price)
            "100000000000000000000"  // Amount to buy (in smallest unit)
        ],
    });

    const { transactionHash } = await sendTransaction({
        account: smartAccount,
        transaction,
    });
    return transactionHash;
};

export const getOrderManagerAddress = async ({
    client,
    chain,
    contractAddress,
}: any): Promise<string> => {
    const contract = getContract({
        client,
        chain,
        address: contractAddress,
        abi:  multiTokenKeeperAbi as any,
    });


    const keeperAddress = await readContract({
        contract,
        method: "orderManager",
        params: [],
    });

    return keeperAddress;
};
