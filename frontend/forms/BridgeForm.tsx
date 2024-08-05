import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
} from "@ionic/react";

import { bridgeToken } from "../contracts/crossChainTokenRouter";
import { BigNumber } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { approveERC20, checkAllowance } from "../contracts/erc20";

import { chainDetails } from "../src/config/chains";
import {
  getAvailableChains,
  createClient,
  validateTokenAndChain,
  getTokenOptions,
  getFilteredTokenOptions,
} from "../src/config/helpers";
import { AppDispatch, RootState } from "../src/store/store";
import { connectWallet } from "../src/store/wallet/walletThunk";
import { arrowBackOutline } from "ionicons/icons";
import { useHistory } from "react-router";

const defaultAllowanceAmount =
  "1000000000000000000000000000000000000000000000000000000000000000000000000000";

const MyForm: React.FC = () => {
  const history = useHistory();
  const [fromToken, setFromToken] = useState<string>("");
  const [fromChain, setFromChain] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [toChain, setToChain] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const { smartAccount } = useSelector((state: RootState) => state.wallet);

  const [availableFromChains, setAvailableFromChains] = useState<string[]>([]);
  const [availableToChains, setAvailableToChains] = useState<string[]>([]);

  useEffect(() => {
    dispatch(connectWallet());
  }, [dispatch]);

  useEffect(() => {
    setAvailableFromChains(getAvailableChains(fromToken));
  }, [fromToken]);

  useEffect(() => {
    setAvailableToChains(getAvailableChains(toToken));
  }, [toToken]);

  const handleTokenChange = (value: string, isFromToken: boolean) => {
    const [symbol, chainName] = value.split("-");
    if (isFromToken) {
      setFromToken(symbol);
      setFromChain(chainName);
    } else {
      setToToken(symbol);
      setToChain(chainName);
    }
  };

  const handleChainChange = (value: string, isFromChain: boolean) => {
    if (isFromChain) {
      setFromChain(value);
    } else {
      setToChain(value);
    }
  };

  const handleSwap = async () => {
    if (!smartAccount) return; // Early exit if smartAccount is not available

    const client = createClient();

    try {
      const { fromTokenDetails, fromChainDetails, toTokenDetails, toChainDetails } =
        validateTokenAndChain(fromToken, fromChain, toToken, toChain);

      const swapDetails = {
        fromTokenSymbol: fromTokenDetails.symbol,
        fromTokenAddress: fromChainDetails.address,
        fromChain,
        toTokenSymbol: toTokenDetails.symbol,
        toTokenAddress: toChainDetails.address,
        toChain,
        amount: 1000,
      };

      const chainDetail = (chainDetails as any)[fromChain.toLowerCase()];
      const destinationLaneId = chainDetails.getLaneDetails(
        fromChain.toLowerCase(),
        toChain.toLowerCase()
      );

      const allowance = await checkAllowance({
        ownerAddress: smartAccount.address,
        spenderAddress: chainDetail.routerAddress,
        client,
        chain: chainDetail.chain,
        contractAddress: swapDetails.fromTokenAddress,
      });

      const parsedBigNumberAllownce = BigNumber.from(allowance.toString());

      const swapAmount = BigNumber.from(Math.floor(Number(swapDetails.amount))).mul(
        BigNumber.from("1000000000000000000")
      );

      if (!parsedBigNumberAllownce.gte(swapAmount)) {
        // TODO Add new MODAL TO SHOW WE ARE APPROVING TOKEN TO SWAP PLEASE WAIT FOR SOME TIME
        await approveERC20({
          smartAccount,
          client,
          chain: chainDetail.chain,
          spenderAddress: chainDetail.routerAddress,
          amount: defaultAllowanceAmount,
          contractAddress: swapDetails.fromTokenAddress,
        });
      }

      const bridged = await bridgeToken({
        tokenAddress: swapDetails.fromTokenAddress,
        destinationLaneId,
        receiver: smartAccount.address,
        amount: swapAmount.toString(),
        client,
        contractAddress: chainDetail.routerAddress,
        chain: chainDetail.chain,
        smartAccount,
      });

      console.log(bridgeToken);
    } catch (error) {
      console.error("Errror during swap", error);
    }
  };

  return (
    <IonGrid className="grid gap-4 rounded-lg p-4 py-32">
      <IonRow className="ion-justify-content-between flex w-full justify-between gap-3">
        <IonCol size="auto" onClick={() => history.goBack()} className="cursor-pointer">
          <IonIcon className="text-3xl" icon={arrowBackOutline} />
        </IonCol>
        <IonCol size="auto">
          <IonImg className="h-8 w-auto" src="AppLogo.svg" />
        </IonCol>
      </IonRow>

      <IonRow className="gap-6">
        <IonCol>
          <IonGrid>
            <IonRow>
              <IonLabel>Token</IonLabel>
              <IonSelect
                interface="popover"
                placeholder="Select "
                value={fromToken ? `${fromToken}-${fromChain}` : ""}
                onIonChange={(e) => handleTokenChange(e.detail.value, true)}
              >
                {getTokenOptions().map((option) => (
                  <IonSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol>
          <IonGrid>
            <IonRow>
              <IonLabel>From </IonLabel>
              <IonSelect
                interface="popover"
                placeholder="Select "
                value={fromChain}
                onIonChange={(e) => handleChainChange(e.detail.value, true)}
                disabled={!fromToken}
              >
                {availableFromChains.map((chainName) => (
                  <IonSelectOption key={chainName} value={chainName}>
                    {chainName}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>

      <IonRow className="gap-6">
        <IonCol>
          <IonGrid>
            <IonRow>
              <IonLabel> Token</IonLabel>
              <IonSelect
                interface="popover"
                placeholder="Select "
                value={toToken ? `${toToken}-${toChain}` : ""}
                onIonChange={(e) => handleTokenChange(e.detail.value, false)}
              >
                {getFilteredTokenOptions(fromToken, fromChain).map((option) => (
                  <IonSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol>
          <IonGrid>
            <IonRow>
              <IonLabel>To </IonLabel>
              <IonSelect
                interface="popover"
                placeholder="Select "
                value={toChain}
                onIonChange={(e) => handleChainChange(e.detail.value, false)}
                disabled={!toToken}
              >
                {availableToChains.map((chainName) => (
                  <IonSelectOption key={chainName} value={chainName}>
                    {chainName}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>

      <IonRow className="gap-6">
        <IonCol>
          <IonItem className="rounded-md">
            <IonInput
              type="number"
              value={amount}
              label="Amount"
              labelPlacement="floating"
              onIonChange={(e) => setAmount(e.detail.value!)}
            />
          </IonItem>
        </IonCol>
      </IonRow>

      <IonRow className="mt-2 flex w-full justify-end">
        <IonButton color="primary" onClick={handleSwap}>
          Swap
        </IonButton>
      </IonRow>
    </IonGrid>
  );
};

export default MyForm;
