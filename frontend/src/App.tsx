// src/App.tsx
import { IonRouterOutlet } from "@ionic/react";
import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import { getAccessToken, isTokenValid } from "./config/authTokens";
import ArtiicialIntelligence from "./pages/ArtificialIntelligence";
import Login from "./pages/auth/Login";
import LoginOrSignup from "./pages/auth/LoginOrSignup";
import SignupEmail from "./pages/auth/SignupEmail";
import SignupPassword from "./pages/auth/SignupPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import BridgeForm from "./pages/BridgeForm";
import ChatBot from "./pages/ChatBot";
import Home from "./pages/Home";
import TradeForm from "./pages/TradeForm";
import Transaction from "./pages/Transaction";
import TransactionList from "./pages/TransactionList";
import Orders from "./pages/Order";
import 'core-js/features/bigint';


const App: React.FC = () => {
  const history = useHistory();

  const token = getAccessToken();
  const isLoggedIn = isTokenValid(token);
  useEffect(() => {
    if (isLoggedIn) {
      history.push("/home");
    }
  }, [isLoggedIn, history]);

  return (
    <IonRouterOutlet>
      <Switch>
        <Route path="/" exact component={LoginOrSignup} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup/email" exact component={SignupEmail} />
        <Route path="/signup/password" exact component={SignupPassword} />
        <Route path="/signup/verifyEmail" exact component={VerifyEmail} />
        <AuthenticatedRoute path="/home" exact component={Home} />
        <AuthenticatedRoute path="/bridge" exact component={BridgeForm} />
        <AuthenticatedRoute path="/trade" exact component={TradeForm} />
        <AuthenticatedRoute path="/transactionList" exact component={TransactionList} />
        <AuthenticatedRoute path="/transaction" exact component={Transaction} />
        <AuthenticatedRoute path="/ai" exact component={ArtiicialIntelligence} />
        <AuthenticatedRoute path="/ai/chatbot" exact component={ChatBot} />
        <AuthenticatedRoute path="/orders" exact component={Orders} />
      </Switch>
    </IonRouterOutlet>
  );
};

export default App;
