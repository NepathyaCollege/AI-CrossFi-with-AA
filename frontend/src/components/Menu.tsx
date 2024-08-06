import {
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonToolbar,
} from "@ionic/react";

const menuItems = [
  {
    label: "Wallet",
    link: "/wallet",
  },
  {
    label: "Profile",
    link: "/profile",
  },
  {
    label: "Settings",
    link: "/settings",
  },
  {
    label: "Bridge",
    link: "/bridge",
  },
  {
    label: "Trade",
    link: "/trade",
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
        <IonList>
          {menuItems.map((item) => (
            <IonMenuToggle key={item.label}>
              <IonItem routerLink={item.link}>
                <IonLabel>{item.label}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
