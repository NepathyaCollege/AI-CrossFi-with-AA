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
import {
  cashOutline,
  logOutOutline,
  optionsOutline,
  personOutline,
  settingsOutline,
  swapVerticalOutline,
} from "ionicons/icons";
import { clearTokens } from "../config/authTokens";

const menuItems = [
  {
    label: "Profile",
    link: "/profile",
    icon: <IonIcon icon={personOutline} />,
  },

  {
    label: "Bridge",
    link: "/bridge",
    icon: <IonIcon icon={optionsOutline} />,
  },
  {
    label: "Trade",
    link: "/trade",
    icon: <IonIcon icon={swapVerticalOutline} />,
  },
  {
    label: "Transactions",
    link: "/transactions",
    icon: <IonIcon icon={cashOutline} />,
  },
  {
    label: "Settings",
    link: "/settings",
    icon: <IonIcon icon={settingsOutline} />,
  },
];

const Menu = () => {
  return (
    <IonMenu type="overlay" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonImg className="mt-2 h-16 w-32 pl-4" src="AppLogo.svg" />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid className="mt-3">
          {menuItems.map((item) => (
            <IonItem
              className="no-border-bottom  hover:bg-background-tertiary  my-1"
              routerLink={item.link}
            >
              <IonCol className="text-2xl flex mr-2" size="auto">
                {item.icon}
              </IonCol>
              <IonLabel className="flex  w-full items-center gap-3">{item.label}</IonLabel>
            </IonItem>
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
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonGrid>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
