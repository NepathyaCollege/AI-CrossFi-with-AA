import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonCol,
  IonContent,
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

import { bridgeToken } from "../../../contracts/crossChainTokenRouter";
import { BigNumber } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { approveERC20, checkAllowance } from "../../../contracts/erc20";

import { chainDetails } from "../../config/chains";
import {
  getAvailableChains,
  createClient,
  validateTokenAndChain,
  getTokenOptions,
  getFilteredTokenOptions,
} from "../../config/helpers";
import { AppDispatch, RootState } from "../../store/store";
import { arrowBackOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { connectWallet } from "../../store/wallet/walletThunk";

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
    } catch (error) {
      console.error("Errror during swap", error);
    }
  };

  return (
    <>
      <IonContent>
        <div>
          <IonGrid className="ion-padding">
            <IonRow>
              <IonCol className="ion-padding">
                <IonLabel>Token</IonLabel>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem>
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
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol className="ion-padding">
                <IonLabel>From</IonLabel>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem>
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
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonGrid className="ion-padding">
            <IonRow>
              <IonCol className="ion-padding">
                <IonLabel>Token</IonLabel>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem>
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
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol className="ion-padding">
                <IonLabel>To</IonLabel>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem>
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
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonGrid className="ion-padding">
            <IonRow className="">
              <IonCol>
                <IonItem className="rounded-md ion-margin-bottom">
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

            <IonRow className="ion-padding-top">
              <IonCol>
                <IonButton expand="block" color="primary" onClick={handleSwap}>
                  Swap
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </>
  );
};

export default MyForm;
