// src/App.tsx
import { IonRouterOutlet } from "@ionic/react";
import React from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import BridgeForm from "./components/forms/BridgeForm";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Login from "./pages/auth/Login";
import LoginOrSignup from "./pages/auth/LoginOrSignup";
import SignupEmail from "./pages/auth/SignupEmail";
import SignupPassword from "./pages/auth/SignupPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Home from "./pages/Home";
import TradeForm from "./components/forms/TradeForm";

const App: React.FC = () => {
  const dispatch = useDispatch();

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
      </Switch>
    </IonRouterOutlet>
  );
};

export default App;
