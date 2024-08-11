import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { BigNumber, ethers } from "ethers";
import { swapVerticalOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { bridgeToken } from "../../contracts/crossChainTokenRouter";
import { approveERC20, checkAllowance, getBalance } from "../../contracts/erc20";
import { chainDetails, tokens } from "../config/chains";
import {
  createClient,
  getAvailableChains,
  getFilteredTokenOptions,
  getTokenOptions,
  validateTokenAndChain,
} from "../config/helpers";
import { AppDispatch, RootState } from "../store/store";
import Transaction from "./Transaction";
import TransactionProcessingModal from "../components/TransactionProcessingModal";
import InsufficientBalanceModal from "../components/InsufficientBalanceModal";
import BridgeStatusModal from "../components/BridgeStatusModal";

const defaultAllowanceAmount =
  "1000000000000000000000000000000000000000000000000000000000000000000000000000";

const MyForm: React.FC = () => {
  const history = useHistory();
  const [fromToken, setFromToken] = useState<string>("");
  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);
  const [fromChain, setFromChain] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [toChain, setToChain] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [fromTokenBalance, setFromTokenBalance] = useState<string>("0.00");
  const [transactionHash, setTransactionHash] = useState<any>("");

  const dispatch = useDispatch<AppDispatch>();
  const { smartAccount } = useSelector((state: RootState) => state.wallet);

  const [availableFromChains, setAvailableFromChains] = useState<string[]>([]);
  const [availableToChains, setAvailableToChains] = useState<string[]>([]);
  const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = useState<boolean>(false);

  // useEffect(() => {
  //   dispatch(connectWallet());
  // }, [dispatch]);

  useEffect(() => {
    setAvailableFromChains(getAvailableChains(fromToken));
  }, [fromToken]);

  useEffect(() => {
    setAvailableToChains(getAvailableChains(toToken));
  }, [toToken]);

  const handleTokenChange = async (value: string, isFromToken: boolean) => {
    const [symbol, chainName] = value.split("-");
    if (isFromToken) {
      setFromToken(symbol);
      setFromChain(chainName);

      // fetch balance
      const tokenDetails = tokens.find((token) => token.symbol === symbol);
      if (tokenDetails) {
        const tokenAddress = tokenDetails.chains.find(
          (chain) => chain.chainName === chainName
        )?.address;
        if (tokenAddress) {
          try {
            const client = createClient();
            const chainDetail = (chainDetails as any)[chainName.toLowerCase()];
            if (chainDetail) {
              const balance = await getWalletBalance(
                smartAccount,
                client,
                chainDetail,
                tokenAddress
              );

              // setFromTokenBalance(balance.toString());
              setFromTokenBalance(ethers.utils.formatUnits(balance.toString(), 18));
            }
          } catch (error) {
            console.error("Error fetching balance:", error);
          }
        }
      }
    } else {
      setToToken(symbol);
      setToChain(chainName);
    }
  };
  // Method to validate tokens and chains, and return swap details
  const getSwapDetails = (
    fromToken: string,
    fromChain: string,
    toToken: string,
    toChain: string
  ) => {
    const { fromTokenDetails, fromChainDetails, toTokenDetails, toChainDetails } =
      validateTokenAndChain(fromToken, fromChain, toToken, toChain);

    // Return an object containing all the details needed for the swap
    return {
      fromTokenSymbol: fromTokenDetails.symbol,
      fromTokenAddress: fromChainDetails.address,
      fromChain,
      toTokenSymbol: toTokenDetails.symbol,
      toTokenAddress: toChainDetails.address,
      toChain,
      amount, // Swap amount (assumed static for now, could be dynamic)
    };
  };

  // Method to retrieve the wallet balance for a given token on a specific chain
  const getWalletBalance = async (
    smartAccount: any,
    client: any,
    chainDetail: any,
    tokenAddress: string
  ) => {
    // Get balance from the chain
    const walletBalance = await getBalance({
      accountAddress: smartAccount.address,
      client,
      chain: chainDetail.chain,
      contractAddress: tokenAddress,
    });

    // Convert the balance from wei to Ether units for readability
    return BigNumber.from(walletBalance);
  };
  // Method to check if the user has enough token allowance for the swap and approve if not
  const ensureAllowance = async (
    smartAccount: any,
    client: any,
    chainDetail: any,
    swapAmount: BigNumber,
    tokenAddress: string
  ) => {
    // Retrieve the current token allowance for the router contract
    const allowance = await checkAllowance({
      ownerAddress: smartAccount.address,
      spenderAddress: chainDetail.routerAddress,
      client,
      chain: chainDetail.chain,
      contractAddress: tokenAddress,
    });

    const parsedBigNumberAllowance = BigNumber.from(allowance.toString());

    // const swapAmountInBigNumber = BigNumber.from(swapAmount);

    // If the allowance is less than the swap amount, approve more tokens
    if (!parsedBigNumberAllowance.gte(swapAmount)) {
      // TODO add one model to show approving is doing
      const allowanceTransactionHash = await approveERC20({
        smartAccount,
        client,
        chain: chainDetail.chain,
        spenderAddress: chainDetail.routerAddress,
        amount: BigNumber.from(defaultAllowanceAmount), // Approve a default high allowance
        contractAddress: tokenAddress,
      });
      console.log(allowanceTransactionHash); // Log the transaction hash for debugging
    }
  };

  // Method to perform the token bridging transaction
  const bridgeTokenTransaction = (
    swapDetails: any,
    destinationLaneId: string,
    smartAccount: any,
    client: any,
    chainDetail: any,
    swapAmount: BigNumber
  ) => {
    return bridgeToken({
      tokenAddress: swapDetails.fromTokenAddress, // Address of the token to be bridged
      destinationLaneId, // Lane ID for cross-chain transfer
      receiver: smartAccount.address, // The account to receive the tokens on the destination chain
      amount: swapAmount, // The amount of tokens to bridge
      client,
      contractAddress: chainDetail.routerAddress, // Router contract address for bridging
      chain: chainDetail.chain, // Source chain information
      smartAccount,
    });
  };

  const handleChainChange = (value: string, isFromChain: boolean) => {
    if (isFromChain) {
      setFromChain(value);
    } else {
      setToChain(value);
    }
  };

  const handleSwap = async () => {
    if (!smartAccount) return;

    const client = createClient();

    try {
      const swapDetails = getSwapDetails(fromToken, fromChain, toToken, toChain);

      // Retrieve chain details for the source chain
      const chainDetail = (chainDetails as any)[swapDetails.fromChain.toLowerCase()];
      // Get the lane ID for the cross-chain transfer
      const destinationLaneId = chainDetails.getLaneDetails(
        swapDetails.fromChain.toLowerCase(),
        swapDetails.toChain.toLowerCase()
      );

      // Get the user's wallet balance for the token on the source chain
      const balanceInEther = await getWalletBalance(
        smartAccount,
        client,
        chainDetail,
        swapDetails.fromTokenAddress
      );
      console.log(balanceInEther); // Log the balance for debugging

      const swapAmountInWei = ethers.utils.parseEther(swapDetails.amount);
      console.log(swapAmountInWei);
      // insufficient balance
      if (swapAmountInWei.gt(balanceInEther)) {
        setShowInsufficientBalanceModal(true);
        return;
      }
      setIsLoading(true); // Show spinner

      // Ensure the user has enough token allowance for the swap, approving more if necessary
      await ensureAllowance(
        smartAccount,
        client,
        chainDetail,
        swapAmountInWei,
        swapDetails.fromTokenAddress
      );

      // Perform the bridging transaction
      const tHash = await bridgeTokenTransaction(
        swapDetails,
        destinationLaneId,
        smartAccount,
        client,
        chainDetail,
        swapAmountInWei
      );
      setTransactionHash(tHash);

      // setIsLoading(false); // Hide loading spinner
      setIsOpen(true); // Open confirmation modal

      setIsLoading(false); // Hide spinner
      setIsOpen(true); // Open modal
      setShowTransactionModal(true);
    } catch (error: any) {
      setIsLoading(false); // Hide spinner
      setToastMessage("Please, fill all missing fields"); // Show toast message
      console.error("Error during swap", error);
    }
  };

  return (
    <>
      <IonContent>
        <div>
          <IonGrid className="ion-padding">
            <IonRow className=" gap-4">
              <IonCol className="">
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
              </IonCol>
              <IonCol>
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
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonGrid className=" flex items-center justify-center">
            <IonIcon icon={swapVerticalOutline} className="text-3xl ion-padding-top" />
          </IonGrid>

          <IonGrid className=" ion-padding ">
            <IonRow className="gap-4">
              <IonCol>
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
              </IonCol>

              <IonCol>
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
                  >
                    <IonLabel slot="end" color="success">
                      MAX: {Number(fromTokenBalance).toFixed(4)}
                    </IonLabel>
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow className="ion-padding-top">
              <IonCol>
                <IonButton expand="block" color="primary" onClick={handleSwap}>
                  Bridge
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>

          <TransactionProcessingModal isOpen={isLoading} onClose={() => {}} />

          <InsufficientBalanceModal
            onClose={() => setShowInsufficientBalanceModal(false)}
            isOpen={showInsufficientBalanceModal}
          />

          <BridgeStatusModal
            isOpen={showTransactionModal}
            onClose={() => setShowTransactionModal(false)}
            transactionHash={transactionHash}
          />

          {/* Toast for Error Messages */}
          <IonToast
            isOpen={!!toastMessage}
            message={toastMessage || ""}
            duration={3000}
            onDidDismiss={() => setToastMessage(null)}
          />
        </div>
      </IonContent>
    </>
  );
};

export default MyForm;
