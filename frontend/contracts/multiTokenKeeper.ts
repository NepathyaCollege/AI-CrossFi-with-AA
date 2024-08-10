
import { ThirdwebClient, getContract, prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { multiTokenKeeperAbi } from "./abis/multiTokenKeeperAbi";
import { BigNumber } from "ethers";

// Define an interface for the input parameters
interface AddOrderParams {
    smartAccount: any; // Adjust the type based on your smart account type
    client: ThirdwebClient;       // Adjust the type based on your client type
    chain: any;     // Type of chain (e.g., 'ethereum', 'polygon')
    contractAddress: string;
    tokenAddress: string;
    chainLinkAggregatorAddress: string;
    orderType: 0 | 1;  // 0 for buy, 1 for sell
    priceThreshold: number;
    amountUSD: string;
  }
  

  export const addOrderOnMultiKeeper = async ({
    smartAccount,
    client,
    chain,
    contractAddress,
    tokenAddress,
    chainLinkAggregatorAddress,
    orderType,
    priceThreshold,
    amountUSD,
  }: AddOrderParams): Promise<string> => {
    const contract = getContract({
      client,
      chain,
      address: contractAddress,
      abi: multiTokenKeeperAbi as any, // Adjust if you have a proper ABI type
    });
  
    const amountInEther = BigNumber.from(amountUSD).mul(BigNumber.from("1000000000000000000"));
  
    // This method will add an order to the contract with the specified parameters.
    const transaction = await prepareContractCall({
      contract,
      method: "addOrder",
      params: [
        tokenAddress,              // Token address
        chainLinkAggregatorAddress, // Chainlink aggregator address
        orderType,                  // Order type (0 for buy, 1 for sell)
        priceThreshold,             // Price threshold (target price)
        amountInEther,              // Amount to buy (in smallest unit)
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
