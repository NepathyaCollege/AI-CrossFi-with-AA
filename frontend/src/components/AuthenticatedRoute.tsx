import React, { useEffect } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { getAccessToken } from "../config/authTokens";
import { jwtDecode } from "jwt-decode";
import Header from "./Header";
import { IonAlert, IonPage } from "@ionic/react";
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

            {loading && <IonAlert isOpen={true} message={`Connecting to wallet`}></IonAlert>}
            {error && (
              <IonAlert
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
