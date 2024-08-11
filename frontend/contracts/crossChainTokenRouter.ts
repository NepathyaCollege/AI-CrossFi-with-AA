import { BigNumber, ethers } from "ethers";
import { getContract, prepareContractCall, readContract, sendTransaction } from "thirdweb";

import { crossChainTokenRouterAbis } from "./abis/crossChainTokenRouter";
import { IBridgeToken } from "./interfaces/IBridgeToken";

export const bridgeToken = async ({
  tokenAddress,
  destinationLaneId,
  receiver,
  amount,
  client,
  chain,
  contractAddress,
  smartAccount,
}: IBridgeToken) => {
  const contract = getContract({
    client,
    chain,
    address: contractAddress,
    abi: crossChainTokenRouterAbis as any,
  });

  const transaction = await prepareContractCall({
    contract,
    // Pass the method signature that you want to call
    method: "bridgeToken",
    // and the params for that method
    // Their types are automatically inferred based on the method signature
    params: [tokenAddress, BigNumber.from(destinationLaneId), receiver, amount],
  });

  try {
    const { transactionHash } = await sendTransaction({
      account: smartAccount,
      transaction,
    });
    return transactionHash;
  } catch (error) {
    console.log(error);
  }
};
