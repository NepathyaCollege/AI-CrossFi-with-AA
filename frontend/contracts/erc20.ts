import { ethers } from "ethers";
import { getContract, prepareContractCall, readContract, sendTransaction } from "thirdweb";
import { erc20Abi } from "./abis/erc20Abis";

interface GetBalanceParams {
  accountAddress: string;
  client: any;
  chain: any;
  contractAddress: string;
}

interface CheckAllowanceParams {
  ownerAddress: string;
  spenderAddress: string;
  client: any;
  chain: any;
  contractAddress: string;
}

type Allowance = ethers.BigNumber;

// Define the return type
type Balance = ethers.BigNumber;

export const getBalance = async ({
  accountAddress,
  client,
  chain,
  contractAddress,
}: GetBalanceParams): Promise<Balance> => {
  const contract = getContract({
    client,
    chain,
    address: contractAddress,
    abi: erc20Abi as any,
  });

  const balance: Balance = await readContract({
    contract,
    method: "balanceOf",
    params: [accountAddress],
  });

  return balance;
};

export const approveERC20 = async ({
  smartAccount,
  client,
  chain,
  contractAddress,
  spenderAddress,
  amount,
}: any): Promise<void> => {
  const contract = getContract({
    client,
    chain,
    address: contractAddress,
    abi: erc20Abi as any,
  });

  const test = [spenderAddress, amount];

  console.log(`test===`, test);

  const transaction = await prepareContractCall({
    contract,
    method: "approve",
    params: [spenderAddress, amount],
  });

  const { transactionHash } = await sendTransaction({
    account: smartAccount,
    transaction,
  });
  console.log(transactionHash);
};

export const checkAllowance = async ({
  ownerAddress,
  spenderAddress,
  client,
  chain,
  contractAddress,
}: CheckAllowanceParams): Promise<Allowance> => {
  const contract = getContract({
    client,
    chain,
    address: contractAddress,
    abi: erc20Abi as any,
  });

  debugger;

  const allowance: Allowance = await readContract({
    contract,
    method: "allowance",
    params: [ownerAddress, spenderAddress],
  });

  return allowance;
};
