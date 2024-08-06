import React, { useState } from "react";
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonGrid,
  IonRow,
  IonText,
  IonPage,
  IonCol,
  IonItem,
} from "@ionic/react";
import QRCode from "qrcode.react";
import { formatAddress } from "../../config/helpers";

interface QrCodeProps {
  isOpenQrScanner: boolean;
  toggleQrScanner: () => void;
  smartAddress: string;
}

const QrCode: React.FC<QrCodeProps> = ({ isOpenQrScanner, toggleQrScanner, smartAddress }) => {
  console.log(smartAddress);

  return (
    <IonModal isOpen={isOpenQrScanner}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton className="b" onClick={toggleQrScanner}>
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPage className="flex items-center justify-center h-full">
        <div className="grid gap-2 place-items-center">
          <IonRow className="ion-justify-content-center">
            <IonText className="text-center text-text-textfield2">
              {smartAddress ? formatAddress(smartAddress) : "xxxxx...xxxxxx"}
            </IonText>
          </IonRow>
          <IonRow className="ion-justify-content-">
            <QRCode
              fgColor="#c4ff21"
              bgColor="#000"
              size={300}
              className="w-[200px]"
              value={smartAddress}
            />
          </IonRow>
          <IonRow>
            <IonText>You can receive tokens based on Ethereum</IonText>
          </IonRow>
        </div>
      </IonPage>
    </IonModal>
  );
};

export default QrCode;
