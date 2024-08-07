import { IonCol, IonContent, IonGrid, IonRow, IonText } from "@ionic/react";
import React from "react";

interface TransactionDetail {
  txHash: string;
  txTime: string;
  fromAddress: string;
  toAddress: string;
}

const transactions: TransactionDetail[] = [
  {
    txHash: "0x129a...1c13",
    txTime: "27 seconds ago (August 7, 2024 at 07:47:17 UTC)",
    fromAddress: "0xe1c1...7a04",
    toAddress: "0xe1c1...7a04",
  },
  {
    txHash: "0x234b...2d14",
    txTime: "1 minute ago (August 7, 2024 at 07:48:15 UTC)",
    fromAddress: "0x5f32...a8e7",
    toAddress: "0x9b67...e4d9",
  },
  // Add more transactions here
];

const TransactionList: React.FC = () => {
  console.log(1);
  return (
    <IonContent className="ion-padding">
      <IonGrid className="h-full w-full">
        <IonRow>
          <IonText className="text-xl font-semibold">Latest Transactions</IonText>
        </IonRow>
        {transactions.map((transaction, index) => (
          <IonRow
            key={index}
            className="ion-margin-top text-sm bg-background-secondary rounded-md ion-padding shadow-md shadow-black"
          >
            <IonGrid>
              <IonRow className="ion-margin-bottom">
                <IonText className="text-lg rounded-full w-10 bg-background-tertiary flex items-center justify-center text-center h-10 font-medium">
                  TX
                </IonText>
              </IonRow>
              <IonRow className="">{transaction.txHash}</IonRow>

              <IonRow className="ion-margin-top text-opacity-60 text-white ">
                <IonCol size="12">From : 0xe1c1...7a04</IonCol>
                <IonCol size="12">From : 0xe1c1...7a04</IonCol>
              </IonRow>
            </IonGrid>
          </IonRow>
        ))}
      </IonGrid>
    </IonContent>
  );
};

export default TransactionList;

const re = {
  messageId: "0xa4de784ceeded3993e533c3b0da6087feb5713a5ba548419245a7a44056fbd42", // tx hash

  sourceNetworkName: "ethereum-mainnet-optimism-1", //source network name
  destNetworkName: "ethereum-mainnet-base-1", //destination network name

  root: null, //no root

  origin: "0xb86facf3572377d41ef58dfa598be906ba8acc7d", //origin

  sender: "0xe1c14b9f065dead2e89ee35382f8bd42bdb87a04", //from
  receiver: "0xe1c14b9f065dead2e89ee35382f8bd42bdb87a04", //receiver
  sourceChainId: "10", //source chain
  destChainId: "8453", //destiation chain

  sendTransactionHash: "0xc4bd31d62c7ac191b96391671f2b3d2f155d0fb58fb1403dd6e71e68def489fb", //source tx hash
  sendTimestamp: "2024-08-07T08:13:51", //timestamp

  tokenAmounts: [
    {
      token: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
      amount: "1788148298",
    },
  ],
};
