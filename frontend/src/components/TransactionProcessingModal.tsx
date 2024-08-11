import { IonIcon, IonSpinner } from "@ionic/react";
import { openOutline } from "ionicons/icons";
import React, { useEffect } from "react";
import { MdError } from "react-icons/md";

const TransactionProcessingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  const handleRedirection = () => {};
  return (
    <>
      <div className="fixed inset-0   backdrop bg-black bg-opacity-70 z-40 " onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 ">
        <div className=" p-5 rounded-lg shadow-lg w-3/5  max-w-lg flex flex-col items-center border-2 border-zinc-800 justify-center bg-background-secondary relative">
          <div className="flex justify-center mb-4">
            <IonSpinner name="circular"></IonSpinner>
          </div>
          <h3 className="text-lg mb-1 text-blue-500 ">Please wait</h3>
          <h3
            onClick={() => {
              handleRedirection();
            }}
            className="mb-2 cursor-pointer text-xs text-center  flex gap-2 text-gray-300 items-center"
          >
            We're processing your transaction
            {/* <IonIcon className="text-2xl cursor-pointer hover:text-blue-400" icon={openOutline} /> */}
          </h3>
        </div>
      </div>
    </>
  );
};

export default TransactionProcessingModal;
