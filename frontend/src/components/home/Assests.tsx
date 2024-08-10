import {
  IonCol,
  IonGrid,
  IonImg,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonSpinner,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { getBalance } from "../../../contracts/erc20";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { tokensWithNetwork } from "../../config/tokensList";
import { ethers } from "ethers";

const Assests: React.FC = () => {
  const [chain, setChain] = useState<string>("base");
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { smartAccount, client } = useSelector((state: RootState) => state.wallet);

  const fetchBaseNetwork = async (chain: string) => {
    if (!smartAccount) return;
    setLoading(true);

    const tokens = tokensWithNetwork[chain]?.tokens;
    if (!tokens) {
      setBalances({});
      setLoading(false);
      return;
    }

    const tokenKeys = ["btc", "eth", "usdt"];
    const newBalances: Record<string, string> = {};

    try {
      await Promise.all(
        tokenKeys.map(async (tokenKey) => {
          const token = tokens[tokenKey];
          const contractAddress = token?.address;

          if (contractAddress) {
            try {
              const bigBalance = await getBalance({
                accountAddress: smartAccount.address,
                chain: tokensWithNetwork[chain].chain,
                client,
                contractAddress,
              });
              console.log(bigBalance);
              // debugger;

              // const balance = BigNumber.from(bigBalance)
              //   .div(BigNumber.from("1000000000000000000"))
              //   .toString();
              const balance = ethers.utils.formatUnits(bigBalance, 18);
              console.log(balance);

              newBalances[tokenKey] = balance;
            } catch (error) {
              console.error(`Error fetching balance for ${tokenKey}:`, error);
              newBalances[tokenKey] = "Error fetching balance";
            }
          } else {
            newBalances[tokenKey] = "Address not available";
          }
        })
      );
    } catch (error) {
      console.error("Error fetching balances:", error);
    } finally {
      setBalances(newBalances);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaseNetwork(chain);
  }, [chain, smartAccount]);

  const handleChainChange = (newChain: string) => {
    setChain(newChain);
  };

  return (
    <>
      <IonRow>
        <ChainSegment chain={chain} onChainChange={handleChainChange} />
      </IonRow>
      <IonRow>
        <IonCol>
          <IonGrid className="mt-8 border-2 border-zinc-800 rounded-lg">
            <IonRow className="ion-padding-horizontal text-white font-bold text-lg py-3">
              <IonText>Your Assets</IonText>
            </IonRow>
            <IonRow>
              <IonGrid className="">
                <IonRow className="font-semibold bg-background-tertiary mb-2 ion-padding-horizontal py-3 text-text-textfield2">
                  <IonCol size="6">Assest</IonCol>

                  <IonCol>Balance</IonCol>
                </IonRow>
                {["btc", "eth", "usdt"].map((tokenKey) => (
                  <IonRow key={tokenKey} className="ion-padding-horizontal  py-2">
                    <IonCol className="flex items-center gap-3" size="6">
                      <IonImg
                        src={tokensWithNetwork[chain]?.tokens[tokenKey]?.logoURI}
                        alt={`${tokenKey} logo`}
                        className="w-8 h-8  rounded-full overflow-hidden"
                      />
                      <IonText>{tokensWithNetwork[chain]?.tokens[tokenKey]?.name}</IonText>
                    </IonCol>
                    <IonCol>
                      <IonText className="font-medium">
                        {/* {Number(balances[tokenKey])
                          ? Number(balances[tokenKey]). toFixed(7)
                          : "0.00"} */}
                        {Number(balances[tokenKey])
                          ? Number(balances[tokenKey]).toFixed(4)
                          : "0.00"}
                      </IonText>
                    </IonCol>
                  </IonRow>
                ))}
              </IonGrid>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </>
  );
};

export default Assests;

interface ChainSegmentProps {
  chain: string;
  onChainChange: (chain: string) => void;
}

const ChainSegment: React.FC<ChainSegmentProps> = ({ chain, onChainChange }) => (
  <IonSegment mode="ios" value={chain} onIonChange={(e) => onChainChange(e.detail.value as string)}>
    <IonSegmentButton value="base" className="p-2 font-medium flex items-center text-base">
      <IonImg
        src="https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue-600x600.webp"
        alt="Base Chain"
        className="w-8 h-8 rounded-full overflow-hidden"
      />
      Base
    </IonSegmentButton>
    <IonSegmentButton value="sepolia" className="p-2 font-medium flex items-center text-base">
      <IonImg
        src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg"
        alt="Sepolia Chain"
        className="w-8 h-8 rounded-full overflow-hidden"
      />
      Sepolia
    </IonSegmentButton>
  </IonSegment>
);
