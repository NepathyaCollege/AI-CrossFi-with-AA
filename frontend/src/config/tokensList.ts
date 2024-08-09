import { baseSepolia, optimismSepolia, sepolia } from "thirdweb/chains";

export interface Token {
  name: string;
  decimals: number;
  symbol: string;
  logoURI: string;
  address: string;
}

export interface Network {
  priceFeed: {
    btc: string;
    eth: string;
    link: string;
  };
  tokens: Record<string, Token>;
  logoURI?: string;
  chain:any
}

export interface TokensWithNetwork {
  [network: string]: Network;
}

export const tokensWithNetwork: TokensWithNetwork = {
  sepolia: {
    priceFeed: {
      btc: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
      eth: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      link: "0xc59E3633BAAC79493d908e63626716e204A45EdF",
    },
    tokens: {
      usdt: {
        name: "USDT",
        decimals: 18,
        symbol: "USDT",
        logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
        address: "0x89e7fdbd1ea30300719357a1584c28ee34bcb4be",
      },
      btc: {
        name: "BTC",
        decimals: 18,
        symbol: "BTC",
        logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
        address: "0x35f5868c9563c8b30a6c096b2e80418aa3643102",
      },
      eth: {
        name: "ETH",
        decimals: 18,
        symbol: "ETH",
        logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
        address: "0x7e29ee6ee5ed4195c797b06f20b0a500ea30a79c",
      },
      link: {
        name: "LINK",
        decimals: 18,
        symbol: "LINK",
        logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
        address: "0x3af31c01444f14f5761b7205685bc92663d5bdfb",
      },
    },
    logoURI: "https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg",
    chain:sepolia
  },
  base: {
    priceFeed: {
      btc: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
      eth: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      link: "0xc59E3633BAAC79493d908e63626716e204A45EdF",
    },
    tokens: {
      usdt: {
        name: "USDT",
        decimals: 18,
        symbol: "USDT",
        logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
        address: "",
      },
      btc: {
        name: "BTC",
        decimals: 18,
        symbol: "USDT",
        logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
        address: "",
      },
      eth: {
        name: "ETH",
        decimals: 18,
        symbol: "USDT",
        logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
        address: "",
      },
    },
    logoURI: "https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue-600x600.webp",
    chain:baseSepolia
  },
  optimism: {
    priceFeed: {
      btc: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
      eth: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      link: "0xc59E3633BAAC79493d908e63626716e204A45EdF",
    },
    tokens: {
      usdt: {
        name: "USDT",
        decimals: 18,
        symbol: "USDT",
        logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
        address: "",
      },
      btc: {
        name: "BTC",
        decimals: 18,
        symbol: "USDT",
        logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
        address: "",
      },
      eth: {
        name: "ETH",
        decimals: 18,
        symbol: "USDT",
        logoURI: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=032",
        address: "",
      },
    },
    logoURI: "https://res.coinpaper.com/coinpaper/optimism_logo_6eba6a0c5c.png",
    chain:optimismSepolia
  },
};
