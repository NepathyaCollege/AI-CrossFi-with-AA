export interface Token {
  address?: `0x${string}`;
  logoURI: string;
  symbol: string;
  name: string;
  decimals: number;
  triggerInfo?: {
    priceFeed: string;
    poolFee: number;
  };
  faucet?: {
    amount: string;
  };
  chains?: string[];
}

export const tokens: Array<Token> = [
  {
    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    logoURI: "https://etherscan.io/token/images/weth_28.png",
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
    triggerInfo: {
      priceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
      poolFee: 3000,
    },
    chains: ["Ethereum Sepolia", "Base"], // Available on these chains
  },
  {
    address: "0x45AC379F019E48ca5dAC02E54F406F99F5088099",
    logoURI: "https://etherscan.io/token/images/wbtc_28.png",
    decimals: 8,
    symbol: "WBTC",
    name: "Wrapped BTC",
    triggerInfo: {
      priceFeed: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      poolFee: 3000,
    },
    chains: ["Base"], // Available on Base chain
  },
  {
    address: "0x2E8D98fd126a32362F2Bd8aA427E59a1ec63F780",
    logoURI: "https://etherscan.io/token/images/tethernew_32.png",
    decimals: 6,
    symbol: "USDT",
    name: "Tether USD",
    faucet: {
      amount: "1000",
    },
    chains: ["Optimism", "Ethereum Sepolia"], // Available on these chains
  },
  {
    address: "0x65aFADD39029741B3b8f0756952C74678c9cEC93",
    logoURI: "https://etherscan.io/token/images/centre-usdc_28.png",
    decimals: 6,
    symbol: "USDC",
    name: "USD Coin",
    faucet: {
      amount: "1000",
    },
    chains: ["Mode", "Base"], // Available on these chains
  },
  {
    address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    logoURI: "https://etherscan.io/token/images/chainlinktoken_32.png",
    decimals: 18,
    symbol: "LINK",
    name: "Chainlink",
    chains: ["Ethereum Sepolia"], // Available on Ethereum Sepolia chain
  },
];

export const tokenAddresses = [
  "0x2E8D98fd126a32362F2Bd8aA427E59a1ec63F780", // USDT
  "0x65aFADD39029741B3b8f0756952C74678c9cEC93", // USDC
  "0xe9c4393a23246293a8D31BF7ab68c17d4CF90A29", // LINK
  "0xBC33cfbD55EA6e5B97C6da26F11160ae82216E2b", //EURS
  "0x8153A21dFeB1F67024aA6C6e611432900FF3dcb9", //AAVE
];
