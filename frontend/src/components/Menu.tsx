import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonMenu,
  IonMenuToggle,
  IonToolbar,
} from "@ionic/react";
import { cashOutline, homeOutline, logOutOutline, swapVerticalOutline } from "ionicons/icons";
import { FaFirstOrder } from "react-icons/fa";
import { clearTokens } from "../config/authTokens";

import { GiArtificialHive } from "react-icons/gi";
import { TbBuildingBridge } from "react-icons/tb";

const menuItems = [
  {
    label: "Home",
    link: "/home",
    icon: <IonIcon icon={homeOutline} />,
  },
  {
    label: "Bridge",
    link: "/bridge",
    icon: <TbBuildingBridge />,
  },
  {
    label: "Trade",
    link: "/trade",
    icon: <IonIcon icon={swapVerticalOutline} />,
  },
  {
    label: "Transactions",
    link: "/transactionList",
    icon: <IonIcon icon={cashOutline} />,
  },
  {
    label: "Orders",
    link: "/orders",
    icon: <FaFirstOrder />,
  },

  {
    label: "Our AI",
    link: "/ai",
    icon: <GiArtificialHive className="text-[27px]" />,
  },
];

const Menu = () => {
  return (
    <IonMenu type="overlay" contentId="main-content">
      <IonHeader>
        <IonToolbar className="pb-3">
          <IonImg className="mt-2 h-16  w-32 pl-4" src="AppLogo.svg" />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="mt-3 pl-1">
          {menuItems.map((item, index) => (
            <IonMenuToggle key={index}>
              <IonItem
                className="no-border-bottom  hover:bg-background-tertiary  my-1"
                routerLink={item.link}
              >
                <IonCol className="text-[27px] flex mr-2" size="auto">
                  {item.icon}
                </IonCol>
                <IonLabel className="flex  font-medium w-full items-center gap-3">
                  {item.label}
                </IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
          <IonMenuToggle>
            <IonItem
              className="no-border-bottom  hover:bg-background-tertiary "
              onClick={() => clearTokens()}
              routerLink="/login"
            >
              <IonCol className="text-3xl flex mr-2" size="auto">
                <IonIcon icon={logOutOutline} />
              </IonCol>
              <IonLabel className="font-medium">Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonGrid>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
