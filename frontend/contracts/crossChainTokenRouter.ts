import { BigNumber, ethers } from "ethers";
import { getContract, prepareContractCall, readContract, sendTransaction } from "thirdweb";

import { crossChainTokenRouterAbis } from "./abis/crossChainTokenRouter";
import { IBridgeToken } from "./interfaces/IBridgeToken";

// Define the return type
type Balance = ethers.BigNumber;

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

  debugger;

  console.log({
    tokenAddress,
    destinationLaneId,
    receiver,
    amount,
  });

  /**
   * amount
: 
"1000000000000000000000"
chainId
: 
"16015286601757825753"
receiver
: 
"0xF2EcFb4b7A57986B5f2432f507FF2432B8057d04"
tokenAddress
: 
"0x84cEc3F89A0f28803F177575BbF7b2010A62d2Ec"
   * 
   * 
   */

  const params: any = [
    tokenAddress,
    Number(destinationLaneId),
    receiver,
    BigNumber.from(amount).toBigInt(),
  ];

  console.log(params);
  const transaction = await prepareContractCall({
    contract,
    // Pass the method signature that you want to call
    method: "bridgeToken",
    // and the params for that method
    // Their types are automatically inferred based on the method signature
    params,
  });

  try {
    const { transactionHash } = await sendTransaction({
      account: smartAccount,
      transaction,
    });

    console.log(transactionHash);
  } catch (error) {
    console.log(error);
  }
};

// export const getBalance = async ({
//   accountAddress,
//   client,
//   chain,
//   contractAddress,
// }: GetBalanceParams): Promise<Balance> => {
//   const contract = getContract({
//     client,
//     chain,
//     address: contractAddress,
//     abi: erc20Abi as any,
//   });

//   const balance: Balance = await readContract({
//     contract,
//     method: "balanceOf",
//     params: [accountAddress],
//   });

//   return balance;
// };
