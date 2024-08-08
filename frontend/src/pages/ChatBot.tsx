import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonInput,
  IonRow,
  IonText,
} from "@ionic/react";

import React from "react";

const ChatBot: React.FC = () => {
  return (
    <IonContent className="ion-padding">
      {/* <IonGrid className=" h-4/5 w-full   ">
        <IonRow className="ion-justify-content-center     ion-align-items-center   gap-4 ">
          <IonCol size="12">
            <IonImg src="ChatBot.png" className=" h-20 w-20 rounded-full overflow-hidden mx-auto" />
          </IonCol>
          <IonCol size="auto">
            <IonText className="text-2xl font-bold ">Hi, How can I help you?</IonText>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonGrid className="w-full  h-1/5 justify-end  ">
        <IonRow className="ion-justify-content-end  b">
          <IonInput placeholder="Message ChatGPT" className="rounded-xl overflow-" fill="outline" />
        </IonRow>
      </IonGrid> */}
      {/* <div class="parent-box flex flex-col justify-between h-[300px] border border-gray-300">
        <div class="center-box self-center p-2 border border-black">Centered Box</div>
        <div class="bottom-box self-end p-2 border border-black">Bottom Box</div>
      </div> */}
    </IonContent>
  );
};

export default ChatBot;
