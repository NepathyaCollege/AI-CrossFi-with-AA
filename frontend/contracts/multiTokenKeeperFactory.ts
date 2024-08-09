import { ethers } from "ethers";
import { getContract, prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { multiTokenKeeperFactoryAbi } from "./abis/multiTokenKeeperFactoryAbi";



type Allowance = ethers.BigNumber;

// Define the return type
type Balance = ethers.BigNumber;

export const getMultiTokenKeeper = async ({
  ownerAddress,
  client,
  chain,
  contractAddress,
}: any): Promise<string> => {
  const contract = getContract({
    client,
    chain,
    address: contractAddress,
    abi: multiTokenKeeperFactoryAbi as any,
  });


  const keeperAddress = await readContract({
    contract,
    method: "getMultiTokenKeeper",
    params: [ownerAddress],
  });

  return keeperAddress;
};


export const createMultiTokenKeeper = async ({
  smartAccount,
  client,
  chain,
  contractAddress
}: any): Promise<void> => {
  const contract = getContract({
    client,
    chain,
    address: contractAddress,
    abi: multiTokenKeeperFactoryAbi as any,
  });

  const transaction = await prepareContractCall({
    contract,
    method: "createAndRegisterMultiTokenKeeper",
    params: [smartAccount.address],
  });

  const { transactionHash } = await sendTransaction({
    account: smartAccount,
    transaction,
  });
  console.log(transactionHash);
};