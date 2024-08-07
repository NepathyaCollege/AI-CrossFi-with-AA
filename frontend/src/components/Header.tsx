import {
  IonButtons,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonMenuButton,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { cashOutline, optionsSharp, swapVerticalOutline } from "ionicons/icons";
import React from "react";
import { useLocation } from "react-router-dom";
import Menu from "./Menu";

const Header: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <Menu />
      <div id="main-content">
        <IonHeader>
          <IonToolbar className="bg-background-secondary py-2">
            <IonButtons slot="start">
              <IonMenuButton className="mt-2 ml-1 text-4xl " />
            </IonButtons>
            {path === "/home" ? (
              <IonImg className="mx-auto mt-2 h-16 w-32" src="AppLogo.svg" />
            ) : path === "/bridge" ? (
              <IonItem className="no-border-bottom pt-3">
                <IonText className="mx-auto font-semibold text-2xl ion-align-items-center gap-2 flex">
                  <IonIcon icon={optionsSharp} className="text-3xl" />
                  Bridge
                </IonText>
              </IonItem>
            ) : path === "/trade" ? (
              <IonItem className="no-border-bottom pt-3">
                <IonText className="mx-auto font-semibold text-2xl ion-align-items-center gap-2 flex">
                  <IonIcon icon={swapVerticalOutline} className="text-3xl" />
                  Swap
                </IonText>
              </IonItem>
            ) : path === "/transactionList" ? (
              <IonItem className="no-border-bottom pt-3">
                <IonText className="mx-auto font-semibold text-2xl ion-align-items-center gap-2 flex">
                  <IonIcon icon={cashOutline} className="text-3xl" />
                  Transactions
                </IonText>
              </IonItem>
            ) : null}
          </IonToolbar>
        </IonHeader>
      </div>
    </>
  );
};

export default Header;
