import {
  IonButton,
  IonCol,
  IonContent,
  IonInput,
  IonItem,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";
import React from "react";
import ActionSegment from "../components/form/ActionSegment";
import useTradeForm from "../hooks/useTradeForm";
import { getTokenOptions } from "../config/helpers";

const TradeForm: React.FC = () => {
  const { formState, handleTokenChange, handleAction, setFormState } = useTradeForm();
  const { tokenName, chainName, targetPrice, amountUSD, action, showToast, toastMessage } =
    formState;

  return (
    <IonContent>
      <div className="mt-5 w-72 mx-auto">
        <ActionSegment
          action={action}
          onChange={(newAction) =>
            setFormState((prevState) => ({
              ...prevState,
              action: newAction,
            }))
          }
        />
      </div>

      <div className="ion-padding ion-margin-top" color="primary">
        <IonItem className="ion-margin">
          <IonSelect
            label="Token"
            interface="popover"
            placeholder="Select"
            value={`${tokenName}-${chainName}`}
            onIonChange={(e) => handleTokenChange(e.detail.value!)}
          >
            {getTokenOptions().map((option) => (
              <IonSelectOption key={option.value} value={option.value}>
                {option.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem className="ion-margin">
          <IonInput
            value={targetPrice}
            onIonChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                targetPrice: e.detail.value!,
              }))
            }
            label={action === "buy" ? "Price" : "Sell Price"}
            labelPlacement="floating"
            type="number"
            placeholder={action === "buy" ? "Enter target price" : "Enter sell price"}
          ></IonInput>
        </IonItem>
        <IonItem className="ion-margin">
          <IonInput
            value={amountUSD}
            onIonChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                amountUSD: e.detail.value!,
              }))
            }
            label="Amount"
            type="number"
            labelPlacement="floating"
            placeholder={action === "buy" ? "Enter amount in USD" : "Enter amount to sell in USD"}
          ></IonInput>
        </IonItem>
      </div>

      <IonRow className="mx-5">
        <IonCol>
          <IonButton
            onClick={handleAction}
            className="ion-margin"
            expand="block"
            color={action === "buy" ? "success" : "danger"}
          >
            {action === "buy" ? "Buy" : "Sell"}
          </IonButton>
        </IonCol>
      </IonRow>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() =>
          setFormState((prevState) => ({
            ...prevState,
            showToast: false,
          }))
        }
        message={toastMessage}
        duration={2000}
        position="bottom"
      />
    </IonContent>
  );
};

export default TradeForm;
