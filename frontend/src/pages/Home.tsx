import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonRow, IonText } from "@ionic/react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Wallet from "../components/home/Wallet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { client, connectWallet } from "../store/wallet/walletThunk";
import { getBalance } from "../../contracts/erc20";
import { Account } from "thirdweb/wallets";
import { baseSepolia } from "thirdweb/chains";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { smartAccount }: Account | any = useSelector((state: RootState) => state.wallet);
  useEffect(() => {
    dispatch(connectWallet());

    // const fetchBalance = async () => {
    //   if (smartAccount?.address) {
    //     let a = await getBalance({
    //       accountAddress: smartAccount?.address,
    //       client: client,
    //       contractAddress: "safasfa",
    //       chain: baseSepolia,
    //     });
    //   }
    // };
    // fetchBalance();
  }, [smartAccount?.address]);

  return (
    <IonContent className="ion-padding">
      <IonGrid className=" h-full w-full">
        <IonRow>
          <IonText className="text-xl font-semibold">Nepathya AI Defi Wallet</IonText>
        </IonRow>
        <IonRow className="ion-margin-top text-text-textfield1">
          <IonText className="text-text-textfield2">
            Transact dast and safe Nepathya AI Defi Ecosystem with your smartwallet
          </IonText>
        </IonRow>

        <Wallet />

        <IonRow>
          <IonGrid>
            <IonRow>
              <IonText className="font-semibold">Recent Transactions</IonText>
            </IonRow>
            <IonRow>
              <IonText className="text-text-textfield2">You have no recent transactions</IonText>
            </IonRow>
          </IonGrid>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default Home;
