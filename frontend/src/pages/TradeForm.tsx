import {
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { wallet } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import ActionSegment from "../components/form/ActionSegment";
import { Token, tokensWithNetwork } from "../config/tokensList";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { createClient } from "../config/helpers";
import { getBalance } from "../../contracts/erc20";
import { BigNumber } from "ethers";

// TODO: (Replace with actual API call)
// const fetchTokenBalance = (network: string, token: string) => {
//   return new Promise<number>((resolve) => {
//     setTimeout(() => resolve(Math.random() * 1000), 1000);
//   });
// };

const TradeForm: React.FC = () => {
  const [chainName, setChainName] = useState<string>("sepolia");
  const [tokenName, setTokenName] = useState<string>("");
  const [triggerToken, setTriggerToken] = useState<string>("");
  const { balance: walletBalance } = useSelector((state: RootState) => state.wallet);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [amountUSD, setAmountUSD] = useState<string>("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(walletBalance | 0);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { smartAccount } = useSelector((state: RootState) => state.wallet);

  // useEffect(() => {
  //   if (chainName && tokenName) {
  //     fetchTokenBalance(chainName, tokenName).then(setBalance);
  //   }
  // }, [chainName, tokenName]);

  const handleNetworkChange = (event: any) => {
    const selectedNetwork = event.detail.value as string;
    setChainName(selectedNetwork);
    setTokenName("");
    setTriggerToken("");
  };

  const tokenOptions = chainName
    ? Object.keys(tokensWithNetwork[chainName].tokens).map((tokenKey) => {
      const token: Token = tokensWithNetwork[chainName].tokens[tokenKey];
      return {
        value: tokenKey,
        label: token.name,
      };
    })
    : [];

  const triggerTokenOptions = chainName
    ? Object.keys(tokensWithNetwork[chainName].tokens)
      .filter((tokenKey) => tokenKey !== tokenName)
      .map((tokenKey) => {
        const token: Token = tokensWithNetwork[chainName].tokens[tokenKey];
        return {
          value: tokenKey,
          label: token.name,
        };
      })
    : [];

  const validateFields = () => {
    if (!tokenName || !targetPrice || !amountUSD) {
      setToastMessage("All fields must be filled");
      setShowToast(true);
      return false;
    }
    if (action === "buy" && parseFloat(amountUSD) > (balance || 0)) {
      setToastMessage("Insufficient balance");
      setShowToast(true);
      return false;
    }
    return true;
  };

  // TODO: (Replace with actual API call)
  const fetchTokenBalance = async (network: string, token: string) => {
    const client = createClient();
    debugger;
    if (!smartAccount)
      return
    const balance = await getBalance({ accountAddress: smartAccount.address, chain: tokensWithNetwork[chainName].chain, client, contractAddress: "0x89e7fdbd1ea30300719357a1584c28ee34bcb4be" });
    debugger;

    const flattenedBalance = BigNumber.from(balance).div(BigNumber.from("1000000000000000000")).toNumber();
    return flattenedBalance;
  };


  const handleAction = () => {
    if (validateFields()) {
      console.log({
        action,
        chainName,
        tokenName,
        triggerToken,
        targetPrice,
        amountUSD,
      });

      setShowAlert(true);
    }
  };

  const confirmAction = async () => {
    setLoading(true);
    // ! Simulated (remove this later)
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay

    if (action === "buy") {
      console.log("Buying");
    } else {
      console.log("Selling");
    }

    setToastMessage(`${action.charAt(0).toUpperCase() + action.slice(1)} action performed`);
    setShowToast(true);
    setLoading(false);
    setShowAlert(false);
  };

  return (
    <IonContent className="">
      <div className="mt-5 w-72 mx-auto">
        <ActionSegment action={action} onChange={(newAction) => setAction(newAction)} />
      </div>

      <div className="ion-padding ion-margin-top ">
        {/* Network Selection */}
        <div className="flex ion-ion-margin-vertical">
          {chainName && (
            <div className="flex w-1/2 items-center space-x-4 ml-4">
              <IonImg src={tokensWithNetwork[chainName].logoURI} className="w-16 h-16" />
              <IonLabel className="text-lg font-bold">
                {chainName.charAt(0).toUpperCase() + chainName.slice(1)}
              </IonLabel>
            </div>
          )}

          <IonItem className="ion-margin">
            <IonSelect
              interface="popover"
              placeholder="Select Network"
              value={chainName}
              onIonChange={handleNetworkChange}
            >
              {Object.keys(tokensWithNetwork).map((networkKey) => (
                <IonSelectOption key={networkKey} value={networkKey}>
                  {networkKey.charAt(0).toUpperCase() + networkKey.slice(1)}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </div>

        {/* Trigger Token Selection */}
        <IonItem className="ion-margin">
          <IonLabel>Trigger Token</IonLabel>
          <IonSelect
            placeholder="Select"
            value={tokenName}
            interface="popover"
            onIonChange={(e) => setTokenName(e.detail.value!)}
          >
            {tokenOptions.map((option) => (
              <IonSelectOption key={option.value} value={option.value}>
                {option.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {/* Display Balance */}
        {
          <IonItem className=" ion-margin-horizontal no-border-bottom">
            <IonIcon
              icon={wallet}
              size="large"
              color="primary"
              className="ion-margin-end"
            ></IonIcon>
            <IonLabel>Balance : </IonLabel>
            <IonLabel className="text-lg font-bold">
              {balance !== null ? `${balance.toFixed(2)}` : <IonSpinner name="dots"></IonSpinner>}
            </IonLabel>
          </IonItem>
        }

        {/* Token To Buy Selection */}
        <IonItem className="ion-margin">
          <IonLabel>Token To Buy</IonLabel>
          <IonSelect
            placeholder="Select"
            value={triggerToken}
            interface="popover"
            onIonChange={(e) => setTriggerToken(e.detail.value!)}
          >
            {triggerTokenOptions.map((option) => (
              <IonSelectOption key={option.value} value={option.value}>
                {option.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {/* Price Input */}
        <IonItem className="ion-margin">
          <IonInput
            labelPlacement="floating"
            label={action === "buy" ? "Target Buy Price" : "Target Sell Price"}
            value={targetPrice}
            onIonChange={(e) => setTargetPrice(e.detail.value!)}
            type="number"
            placeholder={action === "buy" ? "Enter target price" : "Enter sell price"}
          />
        </IonItem>

        {/* Amount Input */}
        <IonItem className="ion-margin">
          <IonInput
            labelPlacement="floating"
            label={action === "buy" ? "Amount to Buy" : "Amount to Sell"}
            value={amountUSD}
            onIonChange={(e) => setAmountUSD(e.detail.value!)}
            type="number"
            placeholder={action === "buy" ? "Enter amount " : "Enter amount to sell "}
          />
        </IonItem>
      </div>

      {/* Action Button */}
      <IonRow className="mx-5 mt-4">
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

      {/* Toast Notification */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
      />

      {/* Confirmation Alert */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Confirm Action"}
        message={`Are you sure you want to ${action} ${amountUSD} ${triggerToken} worth of ${tokenOptions.find((option) => option.value === tokenName)?.label}?`}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Confirm",
            handler: confirmAction,
          },
        ]}
      />

      {/* Loader */}
      <IonLoading isOpen={loading} message={`Performing ${action} transaction...`} duration={0} />
    </IonContent>
  );
};

export default TradeForm;
