import { IonRow, IonText } from "@ionic/react";
import React from "react";
import { IFormErrorProps } from "../../interfaces/IFormErrorProps";

const FormError: React.FC<IFormErrorProps> = ({ error, className }) => {
  return (
    <IonRow className={`-mt-4 mb-5 px-3 ${className}`}>
      <IonText color="danger">{error}</IonText>
    </IonRow>
  );
};

export default FormError;
