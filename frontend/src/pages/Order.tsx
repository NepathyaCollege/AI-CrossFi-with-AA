import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
} from "@ionic/react";
import { openOutline } from "ionicons/icons";
import React, { useState } from "react";

const Order: React.FC = () => {
  const [action, setAction] = useState<string>("pending");

  const transactions = [
    {
      id: "1",
      tokenName: "Token A",
      targetPrice: 3000,
      amount: 14000,
      imgSrc: "https://pbs.twimg.com/profile_images/1729594296289173504/VFXjCIOn_400x400.jpg",
    },
    {
      id: "2",
      tokenName: "Token B",
      targetPrice: 1500,
      amount: 5000,
      imgSrc: "https://via.placeholder.com/150",
    },
    {
      id: "3",
      tokenName: "Token C",
      targetPrice: 2500,
      amount: 7000,
      imgSrc: "https://via.placeholder.com/150",
    },
    {
      id: "4",
      tokenName: "Token D",
      targetPrice: 4000,
      amount: 9000,
      imgSrc: "https://via.placeholder.com/150",
    },
  ];

  const handleSegmentChange = (newAction: string) => {
    setAction(newAction);
  };

  return (
    <IonContent className="ion-padding">
      <div className="mt-5 w-72 mx-auto">
        <ActionSegment action={action} onChange={(newAction) => setAction(newAction)} />
      </div>
      <IonGrid className="h-full w-full">
        {transactions?.map((transaction) => (
          <IonRow className="ion-margin-top     text-sm bg-background-secondary rounded-md px-4 py-6 shadow-md shadow-">
            <IonGrid>
              <IonRow className="ion-align-items-center font-semibold gap-3">
                <IonCol size="5">Token name</IonCol>
                <IonCol>Target Price</IonCol>
                <IonCol>Amount</IonCol>
              </IonRow>
              <IonRow className="ion-align-items-center mt-2 gap-3">
                <IonCol size="5" className="flex gap-1 items-center">
                  <IonImg
                    className="w-5 h-5 -ml-1 rounded-full overflow-hidden"
                    src="https://pbs.twimg.com/profile_images/1729594296289173504/VFXjCIOn_400x400.jpg"
                  />
                  {transaction.tokenName}
                </IonCol>
                <IonCol>$ {transaction?.targetPrice}</IonCol>
                <IonCol>$ {transaction?.amount}</IonCol>
              </IonRow>
            </IonGrid>
          </IonRow>
        ))}
      </IonGrid>
    </IonContent>
  );
};

export default Order;

interface ActionSegmentProps {
  action: string;
  onChange: (action: string) => void;
}

const ActionSegment: React.FC<ActionSegmentProps> = ({ action, onChange }) => (
  <IonSegment mode="ios" value={action} onIonChange={(e) => onChange(e.detail.value as string)}>
    <IonSegmentButton value="pending" className="p-2 font-medium text-lg">
      In-Order
    </IonSegmentButton>
    <IonSegmentButton value="completed" className="p-2 font-medium text-lg">
      Completed
    </IonSegmentButton>
  </IonSegment>
);
