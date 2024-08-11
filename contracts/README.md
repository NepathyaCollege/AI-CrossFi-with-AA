# Hackathon Project: ETHGLOBAL2024 Superhack

This folder contains all the contracts written for the hackathon Superhack 2024.

## Aim of the current project
- Buy tokens at a specific price.
- Use different tokens for buying and triggering.
- Every pool is on V2, but the system can be easily extended to others.

## Token Addresses on Sepolia
- **USDT:** [`0x89e7fdbd1ea30300719357a1584c28ee34bcb4be`](https://sepolia.etherscan.io/address/0x89e7fdbd1ea30300719357a1584c28ee34bcb4be)
- **Wrapped ETH:** [`0x7e29ee6ee5ed4195c797b06f20b0a500ea30a79c`](https://sepolia.etherscan.io/address/0x7e29ee6ee5ed4195c797b06f20b0a500ea30a79c)
- **Wrapped BTC:** [`0x35f5868c9563c8b30a6c096b2e80418aa3643102`](https://sepolia.etherscan.io/address/0x35f5868c9563c8b30a6c096b2e80418aa3643102)
- **Wrapped LINK:** [`0x3af31c01444f14f5761b7205685bc92663d5bdfb`](https://sepolia.etherscan.io/address/0x3af31c01444f14f5761b7205685bc92663d5bdfb)

## Token Addresses on Base Sepolia
- **USDT:** [`0xe7A527BD98566FDc99EA72bf16c6cc4eFe3606a0`](https://sepolia.basescan.org/address/0xe7A527BD98566FDc99EA72bf16c6cc4eFe3606a0)
- **Wrapped ETH:** [`0x0f5C50184EF3ADF2581fd115A0eB4f3cC7F296A1`](https://sepolia.basescan.org/address/0x0f5C50184EF3ADF2581fd115A0eB4f3cC7F296A1)
- **Wrapped BTC:** [`0x981e90dE16a26f6A44e39406dD218490D7789e0D`](https://sepolia.basescan.org/address/0x981e90dE16a26f6A44e39406dD218490D7789e0D)
- **Wrapped LINK:** [`0x926B66bCaB5c283023045EBc84Fd215c31911f3B`](https://sepolia.basescan.org/address/0x926B66bCaB5c283023045EBc84Fd215c31911f3B)


All other coins except USDT are only minted and have liquidity on V2 pools.

### Key Points

1. **Main Router per Chain**: 
   - Each blockchain network has a primary router that handles operations such as cross-chain token transfers.
   - The routers on different chains communicate through defined "lanes," which represent the pathways between two chains.

2. **Pools with Burn Authority**:
   - Each pool on the network is authorized to burn tokens as part of the cross-chain transfer process.
   - These pools hold tokens and are equipped with a CCIP receiver, ensuring proper handling and transfer of assets across different networks.

3. **Current Implementation**:
   - **Base to Sepolia**: The system is currently functional for transfers from the Base chain to Sepolia.
   - **Sepolia to Base**: The reverse operation (Sepolia to Base) is not functional due to issues with Thirdweb, a platform we're using for deployment and testing.
   - **Authorization**: We've implemented an `onlyAuthorized` modifier, ensuring that only approved entities can call specific functions within the pool, especially those related to receiving tokens. Due to the Thirdweb issue with Sepolia, we haven’t been able to fully test this functionality.

### Router and Lane Configuration

- **BaseSepolia**:
  - **Router Address**: [`0xFC32a5413768594E1B7b750A21a62C84dFa04D13`](https://sepolia.basescan.org/address/0xFC32a5413768594E1B7b750A21a62C84dFa04D13)
  - **Lane to Sepolia**: `16015286601757825753`

- **Sepolia**:
  - **Router Address**: [`0x7E53B7303BE4665F2C674314f203410E4d9f7A52`](https://sepolia.etherscan.io/address/0x7E53B7303BE4665F2C674314f203410E4d9f7A52)
  - **Lane to Base**: `10344971235874465080`



- **Automation Tasks**:
  - Automatically triggering token purchases when certain price conditions are met.
  - Managing cross-chain messages and ensuring they are executed at the correct time.
  - Handling the process of burning tokens in the appropriate pool based on the transfer direction.

- **Automation Configuration**:
  - Chainlink Automation is used to monitor the price feeds for various tokens like BTC, ETH, and LINK.
  - Specific conditions are set up within the smart contracts to automatically initiate actions when these conditions are met.
  
- **Price Feeds**:
  - **BTC Price Feed**: `0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43`
  - **ETH Price Feed**: `0x694AA1769357215DE4FAC081bf1f309aDC325306`
  - **LINK Price Feed**: `0xc59E3633BAAC79493d908e63626716e204A45EdF`

- **Automation Logic**:
  - **Token Purchase Automation**: The contracts are configured to automatically purchase tokens when their prices reach a specified threshold, using Chainlink Automation to monitor price feeds and trigger transactions.
  - **Cross-Chain Automation**: The system leverages Chainlink's capabilities to handle the timing and execution of cross-chain messages, ensuring seamless operations across different networks.

## MultiKeeperTokenFactory
Central factory to create keepers:
- **MultiKeeperTokenFactory**: [`0x3a1c99A4Ecd699C4675F71Ff018EcF70E57A8Dd9`](https://sepolia.basescan.org/address/0x3a1c99A4Ecd699C4675F71Ff018EcF70E57A8Dd9)


## Special Note
This project is created with Foundry, a blazing fast, portable, and modular toolkit for Ethereum application development written in Rust.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
