import React from "react";
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonImg,
  IonMenuButton,
  IonPage,
  IonItem,
  IonText,
} from "@ionic/react";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Content</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">This is the menu content.</IonContent>
      </IonMenu>
      <div id="main-content">
        <IonHeader>
          <IonToolbar className="bg-background-secondary py-2">
            <IonButtons slot="start">
              <IonMenuButton className="mt-3 text-3xl text-white" />
            </IonButtons>
            {path === "/home" ? (
              <IonImg className="mx-auto mt-2 h-16 w-32" src="AppLogo.svg" />
            ) : path === "/bridge" ? (
              <IonItem className="no-border-bottom pt-3">
                <IonText className="mx-auto font-semibold text-2xl">Bridge & Swap</IonText>
              </IonItem>
            ) : null}
          </IonToolbar>
        </IonHeader>
      </div>
    </>
  );
};

export default Header;
