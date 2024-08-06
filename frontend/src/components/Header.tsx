import {
  IonButtons,
  IonHeader,
  IonImg,
  IonItem,
  IonMenuButton,
  IonText,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useLocation } from "react-router-dom";
import Menu from "./Menu";

const Header: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <Menu />
      <div id="main-content" className="">
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
