import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { ThirdwebProvider } from "thirdweb/react";
import "./theme/tailwind.css";
import "./theme/variables.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.always.css";
import App from "./App";
import store from "./store/store";
import { Provider } from "react-redux";

setupIonicReact();
const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.Fragment>
    <Provider store={store}>
      <ThirdwebProvider>
        <IonApp className="h-screen  w-screen">
          <IonReactRouter>
            <App />
          </IonReactRouter>
        </IonApp>
      </ThirdwebProvider>
    </Provider>
  </React.Fragment>
);
