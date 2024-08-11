import { IonButton, IonCol, IonContent, IonGrid, IonImg, IonRow, IonText } from "@ionic/react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Wallet from "../components/home/Wallet";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { connectWallet } from "../store/wallet/walletThunk";
import { getBalance } from "../../contracts/erc20";
import { Account } from "thirdweb/wallets";
import { baseSepolia } from "thirdweb/chains";
import { createClient } from "../config/helpers";
import Assests from "../components/home/Assests";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { smartAccount } = useSelector((state: RootState) => state.wallet);

  return (
    <IonContent className="ion-padding">
      <IonGrid className=" h-full w-full mt-2">
        <IonRow>
          <IonText className="text-xl font-semibold">Nepathya AI Defi Wallet</IonText>
        </IonRow>
        <IonRow className="py-2 text-text-textfield1">
          <IonText className="text-text-textfield2">
            Transact fast and safe Nepathya AI Defi Ecosystem with your smartwallet.
          </IonText>
        </IonRow>

        <Wallet />

        <Assests />
      </IonGrid>
    </IonContent>
  );
};

export default Home;
