import { tokens } from "../config/chains";
import { ThirdwebClient, createThirdwebClient } from "thirdweb";
import { CLIENT_ID } from "./thirdweb";

export const getTokenOptions = () => {
  return tokens.flatMap((token) =>
    token.chains.map((chain) => ({
      value: `${token.symbol}-${chain.chainName}`,
      label: `${token.symbol} (${chain.chainName})`,
    }))
  );
};

export const getFilteredTokenOptions = (fromToken: string, fromChain: string) => {
  return getTokenOptions().filter((option) => option.value !== `${fromToken}-${fromChain}`);
};

export const getAvailableChains = (tokenSymbol: string) => {
  const token = tokens.find((t) => t.symbol === tokenSymbol);
  return token ? token.chains.map((chain) => chain.chainName) : [];
};

export const createClient = (): ThirdwebClient => {
  return createThirdwebClient({ clientId: CLIENT_ID });
};

// Fetch Token Details
export const getTokenDetails = (tokenSymbol: string) => {
  return tokens.find((t) => t.symbol === tokenSymbol);
};

// Fetch Chain Details
export const getChainDetails = (token: any, chainName: string) => {
  return token.chains.find((c: { chainName: string }) => c.chainName === chainName);
};

// Validate Token and Chain
export const validateTokenAndChain = (
  fromToken: string,
  fromChain: string,
  toToken: string,
  toChain: string
) => {
  const fromTokenDetails = getTokenDetails(fromToken);
  const toTokenDetails = getTokenDetails(toToken);

  if (!fromTokenDetails || !toTokenDetails) {
    throw new Error("Invalid token selection");
  }

  const fromChainDetails = getChainDetails(fromTokenDetails, fromChain);
  const toChainDetails = getChainDetails(toTokenDetails, toChain);

  if (!fromChainDetails || !toChainDetails) {
    throw new Error("Invalid chain selection");
  }

  return {
    fromTokenDetails,
    fromChainDetails,
    toTokenDetails,
    toChainDetails,
  };
};

// format address util

export const formatAddress = (str: string, length: number) => {
  if (str.length <= length) {
    return str; // Return the string as is if it's too short to format
  }

  const startLength = Math.floor(length / 2);
  const endLength = length - startLength;

  const firstPart = str.slice(0, startLength);
  const lastPart = str.slice(-endLength);

  return `${firstPart}...${lastPart}`;
};
