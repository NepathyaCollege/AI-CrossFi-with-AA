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
    logoURI: "https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg",
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
  },
};
