# Hackathon Project: ETHGLOBAL2024 Superhack

This folder contains all the contracts written for the hackathon Superhack 2024.

## Aim of the current project
- Buy tokens at a specific price.
- Use different tokens for buying and triggering.
- Every pool is on V2, but the system can be easily extended to others.

## Token Addresses on Sepolia
- **USDT:** `0x89e7fdbd1ea30300719357a1584c28ee34bcb4be`
- **Wrapped ETH:** `0x7e29ee6ee5ed4195c797b06f20b0a500ea30a79c`
- **Wrapped BTC:** `0x35f5868c9563c8b30a6c096b2e80418aa3643102`
- **Wrapped LINK:** `0x3af31c01444f14f5761b7205685bc92663d5bdfb`

## Token Addresses on Base Sepolia
- **USDT:** `0xe7A527BD98566FDc99EA72bf16c6cc4eFe3606a0`
- **Wrapped ETH:** `0x0f5C50184EF3ADF2581fd115A0eB4f3cC7F296A1`
- **Wrapped BTC:** `0x981e90dE16a26f6A44e39406dD218490D7789e0D`
- **Wrapped LINK:** `0x926B66bCaB5c283023045EBc84Fd215c31911f3B`

All other coins except USDT are only minted and have liquidity on V2 pools.

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
