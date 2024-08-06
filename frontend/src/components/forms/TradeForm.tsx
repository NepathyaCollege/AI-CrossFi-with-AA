import {
  IonButton,
  IonCol,
  IonContent,
  IonInput,
  IonItem,
  IonRow,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import React, { useState } from "react";
import { getTokenOptions } from "../../config/helpers";

const TradeForm: React.FC = () => {
  const [tokenName, setTokenName] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [amountUSD, setAmountUSD] = useState("");

  const handleBuy = () => {
    console.log(`Buy : ${tokenName} @  ${targetPrice} ->  ${amountUSD}`);
  };

  const handleSell = () => {
    console.log(`Sell : ${tokenName} @  ${targetPrice} -> ${amountUSD}`);
  };

  return (
    <IonContent>
      <div className="ion-margin" color="primary">
        <IonItem className="ion-margin">
          <IonSelect
            label="Token"
            interface="popover"
            placeholder="Select "
            value={tokenName}
            onIonChange={(e) => setTokenName(e.detail.value)}
          >
            {getTokenOptions().map((option) => (
              <IonSelectOption key={option.value} value={option.value}>
                {option.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem className="ion-margin">
          <IonInput
            onIonChange={(e) => setTargetPrice(e.detail.value!)}
            label="Price"
            labelPlacement="floating"
            placeholder="Enter target price"
          ></IonInput>
        </IonItem>
        <IonItem className="ion-margin">
          <IonInput
            label="Amount "
            labelPlacement="floating"
            placeholder="Enter amount in USD"
            onIonChange={(e) => setAmountUSD(e.detail.value!)}
          ></IonInput>
        </IonItem>
      </div>

      <IonRow className="ion-margin">
        <IonCol>
          <IonButton
            onClick={handleBuy}
            className="ion-margin "
            expand="block"
            color="success"
            fill="outline"
          >
            Buy
          </IonButton>
        </IonCol>

        <IonCol>
          <IonButton
            onClick={handleSell}
            className="ion-margin"
            expand="block"
            color="danger"
            fill="outline"
          >
            Sell
          </IonButton>
        </IonCol>
      </IonRow>
    </IonContent>
  );
};

export default TradeForm;
