import React from "react";
import { IonInput, IonRow, IonCol, IonChip } from "@ionic/react";
import { IFormInputProps } from "../../interfaces/IFormInputProps";

const FormInput: React.FC<IFormInputProps> = ({
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  // error,
  readonly,
}) => {
  const handleIonInput = (e: CustomEvent) => {
    onChange(e);
    // console.log(e.target.value);
  };

  const handleIonBlur = (e: CustomEvent) => {
    onBlur(e);
  };

  return (
    <>
      <IonRow>
        <IonCol className="w-full">
          <IonChip
            mode="md"
            slot="start"
            color="primary"
            className="rounded-lg px-2 text-xs font-bold text-white"
          >
            New
          </IonChip>

          <IonInput
            mode="md"
            readonly={readonly}
            value={value}
            name={name}
            onIonInput={handleIonInput}
            onIonBlur={handleIonBlur}
            label={name.charAt(0).toUpperCase() + name.slice(1)}
            labelPlacement="floating"
            fill="outline"
            placeholder={placeholder}
            className="mb-6"
          ></IonInput>
        </IonCol>
      </IonRow>
      {/* {error && (
        <IonRow className="b -mt-3 mb-2 px-1">
          <IonCol>
            <div className="text-danger">{error}</div>
          </IonCol>
        </IonRow>
      )} */}
    </>
  );
};

export default FormInput;
