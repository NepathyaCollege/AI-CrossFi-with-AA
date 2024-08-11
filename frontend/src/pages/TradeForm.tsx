import {
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
  IonToast,
} from "@ionic/react";
import { ethers } from "ethers";
import { wallet } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { approveERC20, getBalance } from "../../contracts/erc20";
import { addOrderOnMultiKeeper, getOrderManagerAddress } from "../../contracts/multiTokenKeeper";
import {
  createMultiTokenKeeper,
  getMultiTokenKeeper,
} from "../../contracts/multiTokenKeeperFactory";
import { getActiveOrders, getFulfilledOrders } from "../../contracts/orderManager";
import TradeConfirmationModal from "../components/TradeConfirmationModal";
import ActionSegment from "../components/form/ActionSegment";
import { createClient } from "../config/helpers";
import { Token, tokensWithNetwork } from "../config/tokensList";
import { RootState } from "../store/store";

import TransactionProcessingModal from "../components/TransactionProcessingModal";
import TradeStatusModal from "../components/TradeStatusModal";

const TradeForm: React.FC = () => {
  const [chainName, setChainName] = useState<string>("base");
  const [tokenName, setTokenName] = useState<string>("");
  const [triggerToken, setTriggerToken] = useState<"btc" | "eth" | "link">("btc");
  // const { balance: walletBalance } = useSelector((state: RootState) => state.wallet);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [multiKeeperAddress, setMultiKeeperAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);

  const { smartAccount, loading: walletLoading } = useSelector((state: RootState) => state.wallet);

  const multiTokenKeeperFactory = "0x05663175EB6b36eE039d89Dd9BF0454ece228935";

  //fetching token balance
  useEffect(() => {
    if (chainName && tokenName) {
      fetchTokenBalance(chainName, tokenName);
      fetchMultiTokenKeeper(chainName);
    }
  }, [chainName, tokenName, action]);

  const handleNetworkChange = (event: any) => {
    const selectedNetwork = event.detail.value as string;
    setChainName(selectedNetwork);
    setTokenName("");
    // setTriggerToken("");
  };

  const tokenOptions = chainName
    ? Object.keys(tokensWithNetwork[chainName].tokens)
        .filter((token) => token !== "usdt")
        .map((tokenKey) => {
          const token: Token = tokensWithNetwork[chainName].tokens[tokenKey];
          return {
            value: tokenKey,
            label: token.name,
          };
        })
    : [];

  const validateFields = () => {
    if (!tokenName || !targetPrice || !amount) {
      setToastMessage("All fields must be filled");
      setShowToast(true);
      return false;
    }
    if (action === "buy" && parseFloat(amount) > parseFloat(balance)) {
      setToastMessage("Insufficient balance");
      setShowToast(true);
      return false;
    }
    return true;
  };

  const fetchTokenBalance = async (network: string, token: string) => {
    const client = createClient();

    if (!smartAccount) return;

    const contractAddress =
      action === "buy"
        ? tokensWithNetwork[network]?.tokens["usdt"]?.address
        : tokensWithNetwork[network]?.tokens[token]?.address;

    const balance = await getBalance({
      accountAddress: smartAccount.address,
      chain: tokensWithNetwork[chainName].chain,
      client,
      contractAddress,
    });

    const etherBalance = ethers.utils.formatUnits(balance, 18);
    setBalance(etherBalance);
  };

  const fetchMultiTokenKeeper = async (network: string) => {
    const client = createClient();

    if (!smartAccount) return;

    let address: string = await getMultiTokenKeeper({
      ownerAddress: smartAccount.address,
      chain: tokensWithNetwork[chainName].chain,
      client,
      contractAddress: multiTokenKeeperFactory,
    });
    console.log(address);

    if (
      address.toLocaleLowerCase() === "0x0000000000000000000000000000000000000000".toLowerCase()
    ) {
      // create keeper if no keeper created for user
      await createMultiTokenKeeper({
        smartAccount,
        client,
        chain: tokensWithNetwork[chainName].chain,
        contractAddress: multiTokenKeeperFactory,
      });
    }

    address = await getMultiTokenKeeper({
      ownerAddress: smartAccount.address,
      chain: tokensWithNetwork[chainName].chain,
      client,
      contractAddress: multiTokenKeeperFactory,
    });

    setMultiKeeperAddress(address);

    console.log(`keeper address ${address}`);

    const orderManagerAddress = await getOrderManagerAddress({
      chain: tokensWithNetwork[chainName].chain,
      client,
      contractAddress: address,
    });

    // active ORders
    const activeOrders = await getActiveOrders({
      chain: tokensWithNetwork[chainName].chain,
      client,
      contractAddress: orderManagerAddress,
    });
    console.log(activeOrders);

    // fullfilled ORders
    const fullfilledOrders = await getFulfilledOrders({
      chain: tokensWithNetwork[chainName].chain,
      client,
      contractAddress: orderManagerAddress,
    });
    console.log(fullfilledOrders);
  };

  const handleAction = () => {
    if (validateFields()) {
      console.log({
        action,
        chainName,
        tokenName,
        triggerToken,
        targetPrice,
        amount,
      });

      setShowAlert(true);
    }
  };

  const confirmAction = async () => {
    setShowAlert(false);
    setLoading(true);
    const client = createClient();

    let transactionHash = "";
    if (action === "buy") {
      const approveTransactionHash = await approveERC20({
        smartAccount,
        client,
        chain: tokensWithNetwork[chainName].chain,
        contractAddress: tokensWithNetwork[chainName]?.tokens["usdt"]?.address,
        spenderAddress: multiKeeperAddress,
        amount: "100000000000000000000000000000000000000000000000000000000000000",
      });

      console.log(approveTransactionHash);

      console.log(triggerToken);
      transactionHash = await addOrderOnMultiKeeper({
        smartAccount: smartAccount as any,
        client,
        chain: tokensWithNetwork[chainName].chain,
        contractAddress: multiKeeperAddress,
        amount,
        chainLinkAggregatorAddress: tokensWithNetwork[chainName]?.priceFeed[triggerToken],
        orderType: 0,
        priceThreshold: ethers.utils.parseUnits(targetPrice, 8),
        tokenAddress: tokensWithNetwork[chainName]?.tokens[tokenName]?.address,
      });

      console.log(transactionHash);
      setShowTransactionModal(true);
    } else {
      const approveTransactionHash = await approveERC20({
        smartAccount,
        client,
        chain: tokensWithNetwork[chainName].chain,
        contractAddress: tokensWithNetwork[chainName]?.tokens[tokenName]?.address,
        spenderAddress: multiKeeperAddress,
        amount: "100000000000000000000000000000000000000000000000000000000000000",
      });

      console.log(approveTransactionHash);

      transactionHash = await addOrderOnMultiKeeper({
        smartAccount: smartAccount as any,
        client,
        chain: tokensWithNetwork[chainName].chain,
        contractAddress: multiKeeperAddress,
        amount,
        chainLinkAggregatorAddress: tokensWithNetwork[chainName]?.priceFeed[triggerToken],
        orderType: 1,
        priceThreshold: ethers.utils.parseUnits(targetPrice, 8),
        tokenAddress: tokensWithNetwork[chainName]?.tokens[tokenName]?.address,
      });

      console.log(transactionHash);
    }

    setToastMessage(`${action.charAt(0).toUpperCase() + action.slice(1)} order placed`);
    setShowToast(true);
    setLoading(false);
    setTransactionHash(transactionHash);
    setShowTransactionModal(true);
  };

  return (
    <IonContent className="">
      <div className="mt-5 w-72 mx-auto">
        <ActionSegment
          action={action}
          onChange={(newAction) => setAction(newAction as "buy" | "sell")}
        />
      </div>
      <div className="ion-padding ion-margin-top ">
        {/* Network Selection */}
        <div className="flex ion-margin-vertical ">
          {chainName && (
            <div className="flex w-1/2 items-center space-x-4 ml-4">
              <IonImg src={tokensWithNetwork[chainName].logoURI} className="w-16 h-16" />
              <IonLabel className="text-lg font-bold">
                {chainName.charAt(0).toUpperCase() + chainName.slice(1)}
              </IonLabel>
            </div>
          )}
        </div>

        {/* Trigger Token Selection */}
        <IonItem className="ion-margin">
          <IonLabel>Trigger Token</IonLabel>
          <IonSelect
            placeholder="Select"
            value={triggerToken}
            interface="popover"
            onIonChange={(e) => setTriggerToken(e.detail.value!)}
          >
            {tokenOptions.map((option) => (
              <IonSelectOption key={option.value} value={option.value}>
                {option.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        {/* Token Selection */}
        <IonItem className="ion-margin">
          <IonLabel>{action === "buy" ? "Token To Buy" : "Token To Sell"}</IonLabel>

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
            value={amount}
            onIonChange={(e) => setAmount(e.detail.value!)}
            type="text"
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

      {/* Display Balance */}
      <IonRow className=" ion-margin-horizontal flex justify-center items-center mt-5 w-5/6 no-border-bottom">
        <IonIcon icon={wallet} size="large" color="primary" className="ion-margin-end"></IonIcon>
        <IonLabel>Balance : </IonLabel>
        <IonLabel className="text-lg pl-3 font-bold">
          {balance !== null ? `${Number(balance).toFixed(4)}$` : "xxxx"}
        </IonLabel>
      </IonRow>

      {/* Toast Notification */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
      />

      <TradeConfirmationModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        onConfirm={confirmAction}
        action={action}
        amount={amount}
        triggerToken={triggerToken}
        tokenName={tokenName}
        targetPrice={targetPrice}
        chainName={chainName}
      />

      <TradeStatusModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        transactionHash={transactionHash}
      />
      {/* 
      <IonLoading

        isOpen={loading}
        message={`Processing transaction...`}
        duration={0}
      /> */}

      <TransactionProcessingModal isOpen={loading} onClose={() => {}} />
    </IonContent>
  );
};

export default TradeForm;
