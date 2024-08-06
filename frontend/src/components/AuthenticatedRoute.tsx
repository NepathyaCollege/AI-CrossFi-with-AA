import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { getAccessToken } from "../config/authTokens";
import { jwtDecode } from "jwt-decode";
import Header from "./common/Header";

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

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <>
            <Header />
            <Component {...props} />
          </>
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default AuthenticatedRoute;
