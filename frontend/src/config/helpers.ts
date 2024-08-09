import { tokens } from "../config/chains";
import { ThirdwebClient, createThirdwebClient } from "thirdweb";
import { CLIENT_ID } from "./thirdweb";
import { tokensWithNetwork } from "./tokensList";

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

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    timeZoneName: "short",
    timeZone: "UTC",
  }).format(date);
}

// Function to get token details by address
export function getTokenDetailsByAddress(
  address: string
): { name: string; logoURI: string } | null {
  for (const network of Object.values(tokensWithNetwork)) {
    for (const token of Object.values(network.tokens)) {
      if (token.address === address) {
        return {
          name: token.name,
          logoURI: token.logoURI,
        };
      }
    }
  }
  return null;
}
