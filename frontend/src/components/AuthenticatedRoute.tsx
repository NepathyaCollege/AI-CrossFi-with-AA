import React, { useEffect } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { getAccessToken } from "../config/authTokens";
import { jwtDecode } from "jwt-decode";
import Header from "./Header";
import { IonAlert, IonLoading, IonPage, IonSpinner } from "@ionic/react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useDispatch } from "react-redux";
import { connectWallet } from "../store/wallet/walletThunk";

interface AuthenticatedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

interface DecodedToken {
  exp: number;
}

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const token = getAccessToken();
  const isLoggedIn = isTokenValid(token);

  const { smartAccount, loading, error } = useSelector((state: RootState) => state.wallet);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(connectWallet());
    }
  }, [isLoggedIn, dispatch]);

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <IonPage className="h-screen w-screen  md:w-1/2 xl:w-1/3 2xl:[30%] md:mx-auto md:border md:border-zinc-800">
            <Header />

            {loading && <WalletLoadingModal />}
            {error && (
              <IonAlert
                className="backdrop bg-black bg-opacity-70"
                header="Error"
                isOpen={true}
                message={"Failed to connect to wallet"}
                buttons={["OK"]}
              />
            )}

            <Component {...props} />
          </IonPage>
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default AuthenticatedRoute;

const WalletLoadingModal = () => {
  return (
    <>
      <div className="fixed inset-0  backdrop bg-black bg-opacity-70 z-40 " />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 ">
        <div className=" p-5 rounded-lg shadow-lg w-3/5  max-w-lg flex flex-col items-center border-2 border-zinc-800 justify-center bg-background-secondary relative">
          <div className="flex justify-center mb-4">
            <IonSpinner name="circular"></IonSpinner>
          </div>
          <h3 className="text-lg mb-1 text-blue-500 ">Please wait</h3>
          <h3 className="mb-2 cursor-pointer text-xs  flex gap-2 text-gray-300 items-center">
            Connecting to the Wallet
          </h3>
        </div>
      </div>
    </>
  );
};
