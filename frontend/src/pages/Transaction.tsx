import { IonCol, IonContent, IonGrid, IonIcon, IonImg, IonRow } from "@ionic/react";
import React from "react";
import { chains } from "../config/chains";
import { checkmarkCircle } from "ionicons/icons";
interface ITransactionDetailProps {
  label: string;
  value: string;
  icon?: string;
  imageUrl?: string;
}

const TransactionDetail: React.FC<ITransactionDetailProps> = ({ label, value, icon, imageUrl }) => (
  <IonRow className="ion-padding gap-2 border-b-2 border-zinc-800">
    <IonCol className="text-gray-100" size="12">
      {label}
      {/* {icon && <IonIcon icon={checkmarkCircle} className="text-green-500" />} */}
    </IonCol>
    <IonCol size="12" className="text-text-textfield2 flex items-center">
      {imageUrl && <IonImg src={imageUrl} className="w-6 h-6 inline-block mr-2" />}
      {value}
    </IonCol>
  </IonRow>
);

const Transaction: React.FC = () => {
  // Helper function to get the chain logo URL by name
  const getChainLogo = (chainName: string) => {
    const chain = chains.find((c) => c.name === chainName);
    return chain ? chain.logoURI : undefined;
  };

  return (
    <IonContent className="ion-padding">
      <IonGrid className="h-auto w-full border-b-2 border-zinc-800 rounded-lg bg-background-secondary">
        <TransactionDetail label="Source Transaction Hash" value="0xabc8...1636" />
        <TransactionDetail label="Destination Transaction Hash" value="0xabc8...1636" />
        <TransactionDetail label="Status" value="Success" icon="checkmark-circle" />
        <TransactionDetail
          label="Source Chain"
          value="Base sepolia"
          imageUrl={getChainLogo("Base")}
        />
        <TransactionDetail
          label="Destination Chain"
          value="Ethereum Sepolia"
          imageUrl={getChainLogo("Ethereum Sepolia")}
        />
        <TransactionDetail
          label="Transaction Timestamp"
          value="1 hour ago (August 7, 2024 at 06:51:04 UTC)"
        />
        <TransactionDetail label="Origin" value="0x20fa0fc715121f50ffe229e0db1504543d04cea3" />
        <TransactionDetail label="Destination" value="0x20fa0fc715121f50ffe229e0db1504543d04cea3" />
      </IonGrid>
    </IonContent>
  );
};

export default Transaction;
