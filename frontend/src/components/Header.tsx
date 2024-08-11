import {
  IonButtons,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonMenuButton,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { optionsSharp, swapVerticalOutline } from "ionicons/icons";
import React from "react";
import { FaFirstOrder } from "react-icons/fa";
import { GiArtificialHive } from "react-icons/gi";
import { TbBuildingBridge } from "react-icons/tb";
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
          <IonToolbar mode="md" className="bg-background-secondary py-2">
            {" "}
            <IonButtons slot="start">
              <IonMenuButton className="mt-2 ml-1 text-4xl " />
            </IonButtons>
            <IonGrid className="w-5/6 ">
              {path === "/home" ? (
                <IonImg className="mx-auto mt-2 h-14  w-28" src="AppLogo.svg" />
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
                    Trade
                  </IonText>
                </IonItem>
              ) : path === "/orders" ? (
                <IonItem className="no-border-bottom pt-3">
                  <IonText className="mx-auto font-semibold text-2xl ion-align-items-center gap-2 flex">
                    <FaFirstOrder className="text-3xl" />
                    Orders
                  </IonText>
                </IonItem>
              ) : path === "/transactionList" ? (
                <IonItem className="no-border-bottom pt-3">
                  <IonText className="mx-auto font-semibold text-2xl ion-align-items-center gap-2 flex">
                    <TbBuildingBridge className="text-3xl" /> Transactions
                  </IonText>
                </IonItem>
              ) : path === "/ai" ? (
                <IonItem className="no-border-bottom pt-3">
                  <IonText className="mx-auto font-semibold text-2xl ion-align-items-center gap-2 flex">
                    <GiArtificialHive className="text-3xl" />
                    Our AI
                  </IonText>
                </IonItem>
              ) : null}
            </IonGrid>
          </IonToolbar>
        </IonHeader>
      </div>
    </>
  );
};

export default Header;
