import { getContract, readContract } from "thirdweb";
import { orderManagerAbi } from "./abis/orderManagerAbi";

export const getActiveOrders = async ({
    client,
    chain,
    contractAddress,
}: any): Promise<string> => {
    const contract = getContract({
        client,
        chain,
        address: contractAddress,
        abi: orderManagerAbi as any,
    });


    const keeperAddress = await readContract({
        contract,
        method: "getActiveOrders",
        params: [],
    });

    return keeperAddress;
};

export const getFulfilledOrders = async ({
    client,
    chain,
    contractAddress,
}: any): Promise<string> => {
    const contract = getContract({
        client,
        chain,
        address: contractAddress,
        abi: orderManagerAbi as any,
    });


    const keeperAddress = await readContract({
        contract,
        method: "getFulfilledOrders",
        params: [],
    });

    return keeperAddress;
};

