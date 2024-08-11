import { baseSepolia, optimismSepolia, sepolia } from "thirdweb/chains";

export interface ChainDetail {
  address: `0x${string}`;
  chainName: string;
  // symbol: string;
}

export interface Token {
  logoURI: string;
  symbol: string;
  name: string;
  decimals: number;
  chains: Array<ChainDetail>;
}

export interface Chain {
  logoURI: string;
  symbol: string;
  name: string;
  decimals: number;
  tokens: Array<string>; // List of token symbols
  triggerInfo?: {
    priceFeed: string;
    poolFee: number;
  };
  faucet?: {
    amount: string;
  };
  chain: any;
  chainId?: number;
}

// Define tokens
export const tokens: Array<Token> = [
  {
    name: "USDT",
    symbol: "USDT",
    decimals: 18,
    logoURI: "https://example.com/base-token-logo.png",
    chains: [
      {
        chainName: "Base",
        address: "0xe7A527BD98566FDc99EA72bf16c6cc4eFe3606a0",
      },
      {
        chainName: "Sepolia",
        address: "0xBE9A39C775073A71dF550678f22a07B3201f26fC",
      },
    ],
  },

  {
    name: "Eth",
    symbol: "Eth",
    decimals: 18,
    logoURI: "https://example.com/sepolia-token-logo.png",
    chains: [
      {
        chainName: "Sepolia",
        address: "0x7e29ee6ee5ed4195c797b06f20b0a500ea30a79c",
      },
      {
        chainName: "Base",
        address: "0x0f5C50184EF3ADF2581fd115A0eB4f3cC7F296A1",
      },
    ],
  },
];

export const chainDetails = {
  base: {
    chain: baseSepolia,
    routerAddress: "0xFC32a5413768594E1B7b750A21a62C84dFa04D13",
    lanes: {
      sepolia: {
        laneId: "16015286601757825753",
      },
    },
  },
  sepolia: {
    chain: sepolia,
    routerAddress: "0x7E53B7303BE4665F2C674314f203410E4d9f7A52",
    lanes: {
      base: {
        laneId: "10344971235874465080",
      },
    },
  },
  getLaneDetails(chainName: string, laneName: string): any {
    const chain = (this as any)[chainName];
    if (!chain) {
      throw new Error(`Chain ${chainName} not found`);
    }
    const lane = chain.lanes[laneName];
    if (!lane) {
      throw new Error(`Lane ${laneName} not found on chain ${chainName}`);
    }
    return lane.laneId;
  },
};

export const chains: Array<Chain> = [
  {
    name: "Base",
    symbol: "BASE",
    decimals: 18,
    logoURI: "https://pbs.twimg.com/profile_images/1729594296289173504/VFXjCIOn_400x400.jpg",
    tokens: tokens
      .filter((token) => token.chains.some((chain) => chain.chainName === "Base"))
      .map((token) => token.symbol),
    chain: baseSepolia,
    chainId: 84532,
  },
  {
    name: "Ethereum Sepolia",
    symbol: "Eth",
    decimals: 18,
    logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025",
    tokens: tokens
      .filter((token) => token.chains.some((chain) => chain.chainName === "Ethereum Sepolia"))
      .map((token) => token.symbol),
    chain: sepolia,
    chainId: 11155111,
  },
];
