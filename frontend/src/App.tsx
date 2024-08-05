import { IonContent, IonPage, IonRouterOutlet } from "@ionic/react";
import { Switch, Route } from "react-router";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Switch>
          <Route path="/home" exact component={Home} />
        </Switch>
      </IonRouterOutlet>
    </IonPage>
  );
};

export default App;
