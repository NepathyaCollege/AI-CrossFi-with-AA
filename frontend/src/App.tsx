import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react";
import { Switch, Route } from "react-router";
import Home from "./pages/Home";
import LoginOrSignup from "./pages/auth/LoginOrSignup";
import SignupEmail from "./pages/auth/SignupEmail";
import SignupPassword from "./pages/auth/SignupPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Login from "./pages/auth/Login";

const App: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Switch>
          <Route path="/" exact component={LoginOrSignup} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup/email" exact component={SignupEmail} />
          <Route path="/signup/password" exact component={SignupPassword} />
          <Route path="/signup/verifyEmail" exact component={VerifyEmail} />
          <Route path="/home" exact component={Home} />
        </Switch>
      </IonRouterOutlet>
    </IonPage>
  );
};

export default App;
