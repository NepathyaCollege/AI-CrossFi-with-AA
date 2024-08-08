import React from "react";
import { IonSegment, IonSegmentButton } from "@ionic/react";

interface ActionSegmentProps {
  action: string;
  onChange: (action: string) => void;
}

const ActionSegment: React.FC<ActionSegmentProps> = ({ action, onChange }) => (
  <IonSegment mode="ios" value={action} onIonChange={(e) => onChange(e.detail.value as string)}>
    <IonSegmentButton value="buy" className="p-2 font-medium text-lg">
      Buy
    </IonSegmentButton>
    <IonSegmentButton value="sell" className="p-2 font-medium text-lg">
      Sell
    </IonSegmentButton>
  </IonSegment>
);

export default ActionSegment;
