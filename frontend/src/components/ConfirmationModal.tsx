import { IonButton, IonImg } from "@ionic/react";
import React from "react";
import { tokensWithNetwork } from "../config/tokensList";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "buy" | "sell";
  amount: string;
  triggerToken: string;
  tokenName: string;
  targetPrice: string;
  chainName: string;
}

const ConfirmationModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  amount,
  triggerToken,
  tokenName,
  targetPrice,
  chainName,
}) => {
  if (!isOpen) return null;

  const chainLogo = tokensWithNetwork[chainName]?.logoURI;
  const tokenLogo = tokensWithNetwork[chainName]?.tokens[tokenName]?.logoURI;
  const triggerTokenLogo = tokensWithNetwork[chainName]?.tokens[triggerToken]?.logoURI;

  return (
    <>
      <div className="fixed inset-0  backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
        <div className="text-white drop-shadow-lg border-2  border-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md relative bg-background-secondary ">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl  text-gray-400 hover:text-gray-200 transition-colors"
          >
            x
          </button>
          <div className="flex items-center mb-6">
            <IonImg
              src={chainLogo}
              className="w-14 h-14 rounded-full border-2 border-gray-700"
              alt={chainName}
            />
            <h2 className="text-2xl font-bold ml-4">
              {chainName.charAt(0).toUpperCase() + chainName.slice(1)}
            </h2>
          </div>

          <h3 className="text-xl font-semibold mb-4">
            {action === "buy" ? "Confirm Buy" : "Confirm Sell"}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IonImg src={tokenLogo} className="w-12 h-12 rounded-full" alt={tokenName} />
                <div className="ml-3">
                  <p className="font-medium text-text-textfield2">Token</p>
                  <p>{tokenName?.toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <IonImg
                  src={triggerTokenLogo}
                  className="w-12 h-12 rounded-full "
                  alt={triggerToken}
                />
                <div className="ml-3">
                  <p className="font-medium text-text-textfield2">Trigger</p>
                  <p>{triggerToken?.toUpperCase()}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <p>
                <strong>Target Price:</strong> {targetPrice}
              </p>
              <p>
                <strong>Amount:</strong> {amount} {triggerToken}
              </p>
            </div>
          </div>

          <IonButton
            onClick={onConfirm}
            expand="block"
            className="mt-6 bg-green-500 hover:bg-green-600 rounded-lg"
          >
            Confirm
          </IonButton>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
