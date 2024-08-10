import { BigNumber } from "ethers";

/**
 * @interface IBridgeToken
 * @description Interface for bridging tokens across different chains.
 */
export interface IBridgeToken {
    /**
     * @property {string} tokenAddress - The actual token address to transfer from one chain to another chain.
     */
    tokenAddress: string;

    /**
     * @property {string} chainId - The destination lane ID where the tokens will be bridged.
     */
    destinationLaneId: string;

    /**
     * @property {string} receiver - The address of the receiver on the destination chain.
     */
    receiver: string;

    amount: BigNumber;

    /**
     * @property {any} client - The client or provider used for blockchain interactions.
     */
    client: any;

    /**
     * @property {string} contractAddress - The cross-chain bridge contract address responsible for handling the token transfer.
     */
    contractAddress: string;

   /**
     * @property {any} chain - The source chain details including RPC URLs and other relevant information.
     */
    chain: any;

    smartAccount:any;
}
