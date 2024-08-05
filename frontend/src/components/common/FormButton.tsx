import React from "react";
import { IonButton } from "@ionic/react";
import { IFormButtonProps } from "../../interfaces/IFormButtonProps";

const FormButton: React.FC<IFormButtonProps> = ({
  type,
  color = "light",
  fill = "clear",
  className = "",
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <IonButton
      size="small"
      type={type === "button" ? "button" : "submit"}
      color={color}
      fill={fill}
      className={`w-full rounded-lg bg-[rgb(196,255,33)] py-1.5 text-lg font-semibold capitalize ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </IonButton>
  );
};

export default FormButton;
