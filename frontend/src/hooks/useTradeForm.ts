// useTradeForm.ts
import { useState } from "react";
import { getChainDetails, getTokenDetails } from "../config/helpers";

const useTradeForm = () => {
  const [formState, setFormState] = useState({
    tokenName: "",
    chainName: "",
    targetPrice: "",
    amountUSD: "",
    action: "buy",
    tokenAddress: "",
    showToast: false,
    toastMessage: "",
  });

  const handleTokenChange = (value: string) => {
    const [selectedToken, selectedChain] = value.split("-");
    const tokenDetails = getTokenDetails(selectedToken);
    const chainDetails = tokenDetails ? getChainDetails(tokenDetails, selectedChain) : null;

    setFormState((prevState) => ({
      ...prevState,
      tokenName: selectedToken,
      chainName: selectedChain,
      tokenAddress: chainDetails ? chainDetails.address : "",
    }));
  };

  const handleAction = () => {
    const { tokenAddress, targetPrice, amountUSD, action } = formState;

    console.log(formState);

    if (!tokenAddress || !targetPrice || !amountUSD) {
      setFormState((prevState) => ({
        ...prevState,
        toastMessage: "Please fill in all missing fields.",
        showToast: true,
      }));
      return;
    }

    if (action === "buy") {
      // TODO - Implement buy logic
    } else {
      // TODO - Implement sell logic
    }

    setFormState((prevState) => ({
      ...prevState,
      toastMessage: `Action executed: ${action} ${formState.tokenName} @ ${targetPrice} with amount ${amountUSD}`,
      showToast: true,
    }));
  };

  return { formState, handleTokenChange, handleAction, setFormState };
};

export default useTradeForm;
