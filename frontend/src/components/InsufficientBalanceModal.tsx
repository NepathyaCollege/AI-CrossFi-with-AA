import { IonIcon } from "@ionic/react";
import { openOutline } from "ionicons/icons";
import React from "react";
import { MdError } from "react-icons/md";

const InsufficientBalanceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleRedirection = () => {
    window.open(
      "https://sepolia.basescan.org/address/0xe7A527BD98566FDc99EA72bf16c6cc4eFe3606a0",
      "_blank"
    );
  };
  return (
    <>
      <div className="fixed inset-0  backdrop bg-black bg-opacity-70 z-40 " onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 ">
        <div className=" p-8 rounded-lg shadow-lg w-4/5  max-w-lg flex flex-col items-center border-2 border-zinc-800 justify-center bg-background-secondary relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl text-gray-300 hover:text-gray-100 transition-colors"
          >
            ×
          </button>
          <div className="flex justify-center mb-4">
            <MdError className=" text-red-500 text-4xl" />
          </div>
          <h3 className="text-xl font-semibold mb-4 ">Insufficient Balance</h3>
          <div
            onClick={() => {
              handleRedirection();
            }}
            className="gap-2 text-blue-500 hover:underline cursor-pointer  items-center flex"
          >
            Click here to mint Test USDC
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

export default InsufficientBalanceModal;
