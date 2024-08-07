import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRow,
  IonText,
  IonSpinner,
  IonAlert,
} from "@ionic/react";
import { openOutline } from "ionicons/icons";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatAddress, formatTimestamp } from "../config/helpers";
import { AppDispatch, RootState } from "../store/store";
import { fetchTransactions } from "../store/transaction/transactionThunk";
import { IonInfiniteScrollCustomEvent } from "@ionic/core";

const TransactionList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { transactions, nextPageToken, loading, error, loadingSkeleton } = useSelector(
    (state: RootState) => state.transaction
  );

  useEffect(() => {
    dispatch(fetchTransactions(nextPageToken));
  }, [dispatch]);

  const loadMoreTransaction = async (e: IonInfiniteScrollCustomEvent<void>) => {
    if (!nextPageToken) {
      e.target.disabled = true;
      console.log("No more transactions to load");
    } else {
      await dispatch(fetchTransactions(nextPageToken)).unwrap();
      e.target.complete();
    }
  };

  return (
    <IonContent className="ion-padding">
      <IonGrid className="h-full w-full">
        {error && <IonAlert isOpen={true} header={"Error"} message={error} buttons={["OK"]} />}
        {loading && loadingSkeleton ? (
          <IonRow className="ion-justify-content-center ion-margin-top">
            <Skeletons />
          </IonRow>
        ) : (
          transactions.map((transaction, index) => (
            <IonRow
              key={index}
              className="ion-margin-top text-sm bg-background-secondary rounded-md px-4 py-4 shadow-md shadow-black"
            >
              <IonGrid>
                <IonRow className="ion-align-items-center gap-3">
                  <IonText className="text-base rounded-full mr-2 w-10 bg-background-tertiary flex items-center justify-center text-center h-10 font-medium">
                    TX
                  </IonText>

                  <IonCol>
                    <IonGrid>
                      <IonRow className="ion-align1-items-center gap-2 text-gray-200 text-base ">
                        {formatAddress(transaction?.transactionHash, 22)}
                      </IonRow>
                      <IonRow className="text-text-textfield2">
                        {formatTimestamp(transaction?.timestamp)}
                        <br />
                      </IonRow>
                    </IonGrid>
                  </IonCol>

                  <IonIcon
                    onClick={() =>
                      window.open(`https://ccip.chain.link/msg/${transaction?.transactionHash}`)
                    }
                    className="text-2xl cursor-pointer hover:text-blue-400"
                    icon={openOutline}
                  />
                </IonRow>
              </IonGrid>
            </IonRow>
          ))
        )}
        <IonInfiniteScroll
          className="my-7"
          threshold="100px"
          disabled={!nextPageToken}
          onIonInfinite={loadMoreTransaction}
        >
          <IonInfiniteScrollContent loadingText="Loading more transactions..." />
        </IonInfiniteScroll>
      </IonGrid>
    </IonContent>
  );
};

export default TransactionList;

const Skeletons = () => {
  return (
    <>
      {Array(10)
        .fill(10)
        .map((_, index) => (
          <IonRow
            key={index}
            className="ion-margin-top w-full animate-pulse h-16  bg-background-secondary rounded-md"
          ></IonRow>
        ))}
    </>
  );
};
