import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonModal,
  IonRow,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { closeCircleOutline, copyOutline } from "ionicons/icons";
import QRCode from "qrcode.react";
import React, { useState } from "react";
import { formatAddress } from "../../config/helpers";
import useClipboard from "../../hooks/useClipboard";

interface QrCodeProps {
  isOpenQrScanner: boolean;
  toggleQrScanner: () => void;
  smartAddress: string | undefined;
}

const QrCode: React.FC<QrCodeProps> = ({ isOpenQrScanner, toggleQrScanner, smartAddress }) => {
  const [isUnderstood, setIsUnderstood] = useState<boolean>(false);
  const { copySuccess, error, handleCopy } = useClipboard();

  return (
    <IonModal className="md:w-1/2 md:mx-auto" isOpen={isOpenQrScanner}>
      <IonToolbar className="px-2">
        <IonButtons slot="end">
          <IonButton
            className="gap-4 ion-align-items-center"
            onClick={() => {
              toggleQrScanner();
              setIsUnderstood(false);
            }}
          >
            Close
          </IonButton>
        </IonButtons>
      </IonToolbar>

      <IonContent>
        <section className="p-4 vertical-center w-auto h-full">
          {isUnderstood ? (
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <QRCode
                  fgColor="#ffff
"
                  bgColor="fs31"
                  size={270}
                  value={smartAddress ? smartAddress : ""}
                />
              </IonRow>

              <IonRow className="ion-justify-content-center w-[310px] mt-10 mx-auto">
                <IonCol
                  size="12"
                  className="px-3 py-2 text-xl relative bg-background-primary border-2 border-zinc-700 rounded-md"
                >
                  <IonText>
                    {smartAddress ? formatAddress(smartAddress, 20) : "xxxxx...xxxxxx"}
                  </IonText>
                  <IonIcon
                    icon={copyOutline}
                    className="bg-background-tertiary absolute hover:brightness-150 cursor-pointer right-1.5 h-8 px-2 top-1 my-auto rounded"
                    onClick={() => smartAddress && handleCopy(smartAddress)}
                  ></IonIcon>
                  {copySuccess && (
                    <IonText className="text-success absolute py-1 px-3 text-sm  rounded-md bg-background-tertiary  right-0 -top-9">
                      Copied!
                    </IonText>
                  )}
                  {error && (
                    <IonText className="text-danger absolute py-1 px-3 text-sm rounded-md bg-background-tertiary right-0 -top-9">
                      {error}
                    </IonText>
                  )}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol
                  className=" text-center text-base text-text-textfield2 font-medium mt-6 mx-auto"
                  size="10"
                >
                  Copy the wallet address to send funds to this wallet.
                </IonCol>
              </IonRow>
            </IonGrid>
          ) : (
            <IonGrid className="grid gap-5">
              <IonRow className="text-3xl font-bold">Depositing Funds</IonRow>

              <IonRow className="text-text-textfield2">
                Ensure this before depositing funds to your Beyond Wallet Address. Failing to do so
                might lead to your funds getting stuck
              </IonRow>

              <IonRow className="ion-align-items-center gap-2 mt-5">
                <IonGrid className="flex flex-col gap-3">
                  <IonRow className="text-2xl font-bold">Supported Chains</IonRow>
                  <IonRow className="ion-align-items-center gap-2">
                    <IonCol size="auto">
                      <IonImg
                        className="w-7 h-7 rounded-full overflow-hidden"
                        src="https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue-600x600.webp"
                      />
                    </IonCol>
                    <IonCol>Base</IonCol>
                  </IonRow>

                  <IonRow className="ion-align-items-center gap-2 rounded-full overflow-hidden">
                    <IonCol size="auto">
                      <IonImg
                        className="w-7 h-7"
                        src="https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg"
                      />
                    </IonCol>
                    <IonCol>Sepolia</IonCol>
                  </IonRow>

                  <IonRow className="ion-align-items-center gap-2 mt-3">
                    <IonButton
                      className="text-white capitalize w-full"
                      onClick={() => setIsUnderstood(true)}
                    >
                      I understand Proceed
                    </IonButton>
                  </IonRow>
                </IonGrid>
              </IonRow>
            </IonGrid>
          )}
        </section>
      </IonContent>
    </IonModal>
  );
};

export default QrCode;
