import {
  IonAlert,
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
  IonSkeletonText,
  IonText,
} from "@ionic/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatAddress } from "../../config/helpers";
import { RootState } from "../../store/store";
import QrCode from "./QrCode";
import useClipboard from "../../hooks/useClipboard";
import { copyOutline } from "ionicons/icons";

const Wallet: React.FC = () => {
  const { smartAccount, loading, error, balance } = useSelector((state: RootState) => state.wallet);
  const { copySuccess, error: copyError, handleCopy } = useClipboard();
  const [isOpenQrScanner, setIsOpenQrScanner] = useState<boolean>(false);

  const toggleQrScanner = () => {
    setIsOpenQrScanner(!isOpenQrScanner);
  };

  return (
    <IonRow className="ion-align-items-center my-6 rounded-lg bg-background-secondary shadow-background-secondary drop-shadow-lg px-2 py-4 text-[17px]">
      <IonGrid>
        {/* wallet address balance and icon */}
        <IonRow>
          <IonCol size="auto">
            <IonButton color="clear" fill="clear">
              <IonImg src="Wallet.png" className="h-12 w-12" />
            </IonButton>
          </IonCol>
          <IonCol>
            <IonGrid className="font-medium relative">
              <IonRow className="mt-4">
                <IonCol>
                  {loading ? (
                    <>
                      <IonSkeletonText
                        animated={loading}
                        className="h-6 rounded-full bg-gray-800 w-28"
                      ></IonSkeletonText>
                      <IonSkeletonText
                        animated={loading}
                        className="h-6 rounded-full bg-gray-800 w-12 mt-2"
                      ></IonSkeletonText>
                    </>
                  ) : (
                    <>
                      <IonText>
                        {smartAccount?.address && formatAddress(smartAccount?.address, 20)}
                      </IonText>
                      <IonIcon
                        icon={copyOutline}
                        className="bg-background-tertiary absolute hover:brightness-150 cursor-pointer right-1.5 p-3 text-2xl -top-2 my-auto rounded"
                        onClick={() => smartAccount?.address && handleCopy(smartAccount?.address)}
                      ></IonIcon>
                      {copySuccess && (
                        <IonText className="text-success absolute py-1 px-3 text-sm  rounded-md bg-background-tertiary  right-0 -top-9">
                          Copied!
                        </IonText>
                      )}
                      {copyError && (
                        <IonText className="text-danger absolute py-1 px-3 text-sm rounded-md bg-background-tertiary right-0 -top-9">
                          {copyError}
                        </IonText>
                      )}
                    </>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>

        <IonRow className="">
          <IonCol>
            <IonGrid className="ion-padding-horizontal ion-margin-top font-medium">
              <IonRow>
                <IonCol>
                  <IonButton
                    onClick={toggleQrScanner}
                    id="click-trigger"
                    mode="md"
                    size="default"
                    className="h-10 w-28 rounded-md bg-secondary font-semibold text-white cursor-pointer"
                    fill="clear"
                    disabled={loading}
                  >
                    Deposit
                  </IonButton>

                  <IonButton
                    mode="md"
                    className="ion-margin-start h-10 w-28 rounded-md bg-text-textfield1 text-white"
                    fill="clear"
                    disabled={loading}
                  >
                    Withdraw
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
      <QrCode
        toggleQrScanner={toggleQrScanner}
        smartAddress={smartAccount?.address}
        isOpenQrScanner={isOpenQrScanner}
      />
    </IonRow>
  );
};

export default Wallet;
