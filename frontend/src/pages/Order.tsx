import { IonContent, IonGrid, IonRow, IonSegment, IonSegmentButton } from "@ionic/react";
import React, { useState } from "react";

const Order: React.FC = () => {
  const [action, setAction] = useState<string>("pending");

  const handleSegmentChange = (newAction: string) => {
    setAction(newAction);
  };

  return (
    <IonContent>
      <div className="mt-5 w-72 mx-auto">
        <ActionSegment action={action} onChange={(newAction) => setAction(newAction)} />
      </div>
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
      Pending
    </IonSegmentButton>
    <IonSegmentButton value="completed" className="p-2 font-medium text-lg">
      Completed
    </IonSegmentButton>
  </IonSegment>
);
