import {
  IonRow,
  IonGrid,
  IonCol,
  IonButton,
  IonImg,
  IonText,
  IonContent,
  IonPopover,
  IonSkeletonText,
} from "@ionic/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { formatAddress } from "../../config/helpers";
import { Account } from "thirdweb/wallets";
import QrCode from "./QrCode";

const Wallet: React.FC = () => {
  const { smartAccount, loading }: Account | any = useSelector<RootState>((state) => state.wallet);
  const [isOpenQrScanner, setIsOpenQrScanner] = useState<boolean>(false);
  const toggleQrScanner = () => {
    setIsOpenQrScanner(!isOpenQrScanner);
  };

  return (
    <IonRow className="ion-align-items-center my-6 rounded-lg bg-background-secondary px-2 py-4 text-[17px]">
      <IonGrid>
        {/* wallet address balance and icon */}
        <IonRow>
          <IonCol size="auto">
            <IonButton color="clear" fill="clear">
              <IonImg src="Wallet.png" className="h-12 w-12" />
            </IonButton>
          </IonCol>
          <IonCol>
            <IonGrid className="font-medium">
              <IonRow>
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
                        {smartAccount?.address && formatAddress(smartAccount?.address, 14)}
                      </IonText>
                      <br />
                      <IonText>${0}</IonText>
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
