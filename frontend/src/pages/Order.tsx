import {
  IonButton,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonItem,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { getActiveOrders, getFulfilledOrders } from "../../contracts/orderManager";
import { createClient, getTokenDetailsByAddress } from "../config/helpers";
import { getOrderManagerAddress } from "../../contracts/multiTokenKeeper";
import { baseSepolia } from "thirdweb/chains";
import {
  createMultiTokenKeeper,
  getMultiTokenKeeper,
} from "../../contracts/multiTokenKeeperFactory";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { BigNumber, ethers } from "ethers";

const multiTokenKeeperFactory = "0x05663175EB6b36eE039d89Dd9BF0454ece228935";

const Order: React.FC = () => {
  const [action, setAction] = useState<string>("pending");
  const { smartAccount } = useSelector((state: RootState) => state.wallet);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors

      try {
        const client = createClient();

        if (!smartAccount) return;

        let address: string = await getMultiTokenKeeper({
          ownerAddress: smartAccount?.address,
          chain: baseSepolia,
          client,
          contractAddress: multiTokenKeeperFactory,
        });

        if (address.toLowerCase() === "0x0000000000000000000000000000000000000000".toLowerCase()) {
          // Create keeper if no keeper created for user
          await createMultiTokenKeeper({
            smartAccount,
            client,
            chain: baseSepolia,
            contractAddress: multiTokenKeeperFactory,
          });
        }

        address = await getMultiTokenKeeper({
          ownerAddress: smartAccount?.address,
          chain: baseSepolia,
          client,
          contractAddress: multiTokenKeeperFactory,
        });

        const orderManagerAddress = await getOrderManagerAddress({
          chain: baseSepolia,
          client,
          contractAddress: address,
        });

        // Fetch orders based on action
        if (action === "pending") {
          const activeOrders = await getActiveOrders({
            chain: baseSepolia,
            client,
            contractAddress: orderManagerAddress,
          });
          setOrdersList([...activeOrders]);
        } else if (action === "completed") {
          const fulfilledOrders = await getFulfilledOrders({
            chain: baseSepolia,
            client,
            contractAddress: orderManagerAddress,
          });
          setOrdersList([...fulfilledOrders]);
        }
      } catch (err: any | unknown) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchOrders();
  }, [smartAccount, action]);

  const handleSegmentChange = (newAction: string) => {
    setAction(newAction); // Update action which triggers useEffect
  };

  const handleCancel = (orderId: string) => {
    // Implement cancel logic here

    console.log(`Cancel button clicked for order ID: ${orderId}`);
  };

  return (
    <IonContent className="ion-padding">
      <div className="mt-5 w-72 mx-auto">
        <ActionSegment action={action} onChange={handleSegmentChange} />
      </div>
      {loading ? (
        <Skeletons />
      ) : error ? (
        <div className="ion-padding">Error: {error}</div>
      ) : (
        <IonGrid className="h-full w-full">
          {ordersList?.map((order) => (
            <IonItemSliding
              key={order?.id}
              className="ion-margin-top text-sm bg-background-secondary rounded-md shadow-md"
            >
              {action === "pending" && (
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => handleCancel(order?.id)}>
                    Cancel
                  </IonItemOption>
                </IonItemOptions>
              )}

              <IonItem>
                <IonGrid className="pl-3 pr-2 py-3">
                  <IonRow className="ion-align-items-center  mb-2 font-semibold text-text-textfield2 ">
                    <IonCol>Type</IonCol>
                    <IonCol>Token</IonCol>
                    <IonCol size="4" className="w-28 ">
                      Target Price
                    </IonCol>
                    <IonCol className="">
                      <IonText className="text-opacity-0 text-black">///</IonText>
                      Amount
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-align-items-center font-semibold text-sm gap-3">
                    {order?.orderType === 0 ? (
                      <IonCol className="text-green-500">Buy</IonCol>
                    ) : (
                      <IonCol className="text-red-500">Sell</IonCol>
                    )}

                    <IonCol className="flex gap-1 items-center">
                      <IonImg
                        className="w-5 h-5  rounded-full overflow-hidden"
                        src={getTokenDetailsByAddress(order?.token)?.logoURI}
                      />
                      {getTokenDetailsByAddress(order?.token)?.name}
                    </IonCol>
                    <IonCol className="" size="4">
                      ${ethers.utils.formatUnits(order?.priceThreshold, 8)}
                    </IonCol>
                    <IonCol size="2" className=" w-auto">
                      ${ethers.utils.formatUnits(order?.amount, 18)}
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonItemSliding>
          ))}
        </IonGrid>
      )}
    </IonContent>
  );
};

export default Order;

interface ActionSegmentProps {
  action: string;
  onChange: (action: string) => void;
}

const ActionSegment: React.FC<ActionSegmentProps> = ({ action, onChange }) => (
  <IonSegment mode="ios" value={action} onIonChange={(e) => onChange(e.detail.value as string)}>
    <IonSegmentButton value="pending" className="p-1 font-medium text-base">
      In-Order
    </IonSegmentButton>
    <IonSegmentButton value="completed" className="p-1 font-medium text-base">
      Completed
    </IonSegmentButton>
  </IonSegment>
);

const Skeletons = () => {
  return (
    <>
      {Array(10)
        .fill(10)
        .map((_, index) => (
          <IonRow
            key={index}
            className="ion-margin-top w-full animate-pulse h-16 bg-background-secondary rounded-md"
          ></IonRow>
        ))}
    </>
  );
};
