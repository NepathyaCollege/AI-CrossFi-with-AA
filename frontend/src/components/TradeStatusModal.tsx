import { IonIcon } from "@ionic/react";
import { openOutline } from "ionicons/icons";
import React from "react";

const TradeStatusModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  transactionHash: string;
}> = ({ isOpen, onClose, transactionHash }) => {
  if (!isOpen) return null;

  const handleRedirection = (transactionHash: string) => {
    window.open(`https://sepolia.basescan.org/tx/${transactionHash}`, "_blank");
  };

  return (
    <>
      <div className="fixed inset-0 b   backdrop bg-black bg-opacity-70 z-40 " onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 ">
        <div className=" p-8 rounded-lg shadow-lg w-3/4  max-w-lg flex flex-col items-center border-2 border-zinc-800 justify-center bg-background-secondary relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl text-gray-300 hover:text-gray-100 transition-colors"
          >
            ×
          </button>
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-4 text-green-400">Transaction Submitted</h3>
          <div
            onClick={() => {
              handleRedirection(transactionHash);
            }}
            className="gap-2 text-blue-500 hover:underline cursor-pointer  items-center flex"
          >
            View on Base
            <IonIcon
              className="text-2xl cursor-pointer hover:text-blue-500  text-text-textfield2 "
              icon={openOutline}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeStatusModal;
