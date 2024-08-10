import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonItem,
  IonRow,
  IonText,
} from "@ionic/react";

import React from "react";
import { PiArrowSquareDownLeftFill } from "react-icons/pi";
import { useHistory } from "react-router";

const ArtiicialIntelligence: React.FC = () => {
  const history = useHistory();
  const handleRedirectToChatBot = () => {
    history.push("/ai/chatbot");
  };

  const handleRedirectToImageGenerator = () => {
    history.push("/ai/chatbot");
  };
  return (
    <IonContent className="ion-padding">
      <IonGrid className=" h-full w-full ion-ion-padding-vertical">
        <IonRow className="ion-padding font-bold text-3xl mb-2">
          <IonText>Our Services</IonText>
        </IonRow>
        {/* Chat bot */}
        <IonRow className="gap-5 mb-7 ion-justify-content-center w-full">
          <IonCol size="12" className="">
            <IonCard className=" rounded-lg flex  gap-4 shadow-black shadow-md  ion-padding ">
              <figure className="flex items-center">
                <IonImg src="ChatBot.png" className="w-20  h-20 rounded-full  overflow-hidden" />
              </figure>

              <IonCardHeader className="">
                <IonCardTitle className="font-bold relative  text-lg mb-1">
                  Chatbot
                  <IonText
                    onClick={handleRedirectToChatBot}
                    className="absolute -right-2 flex gap-1 hover:brightness-125 cursor-pointer items-center border border-gray-900   px-2 py-1 rounded bg-secondary shadow-lg text-base -top-2"
                  >
                    Try
                    <PiArrowSquareDownLeftFill className="-rotate-180 text-xl" />
                  </IonText>
                </IonCardTitle>
                <IonCardSubtitle className=" text-text-textfield2 font-medium  text-justify text-sm">
                  nteract with our AI-powered chatbot for instant support and answers to your
                  questions. Available 24/7 to assist with various queries and provide personalized
                  responses.
                </IonCardSubtitle>
              </IonCardHeader>
            </IonCard>
          </IonCol>
        </IonRow>

        {/* image generator */}

        <IonRow className="gap-5 mb-7 ion-justify-content-center w-full">
          <IonCol size="12" className="">
            <IonCard className=" rounded-lg flex  gap-4 shadow-black  shadow-md  ion-padding ">
              <figure className="flex items-center">
                <IonImg
                  src="ImageGenerator.png"
                  className="w-20  h-20 rounded-full  overflow-hidden"
                />
              </figure>

              <IonCardHeader className="">
                <IonCardTitle className="font-bold relative  text-lg mb-1">
                  Image Generator
                  <IonText
                    onClick={handleRedirectToImageGenerator}
                    className="absolute -right-2 flex gap-1 hover:brightness-125 cursor-pointer items-center border border-gray-900  px-2 py-1 rounded bg-secondary shadow-lg text-base -top-2"
                  >
                    Try
                    <PiArrowSquareDownLeftFill className="-rotate-180 text-xl" />
                  </IonText>
                </IonCardTitle>
                <IonCardSubtitle className=" text-text-textfield2 font-medium  text-justify text-sm">
                  Create stunning images with our AI image generator. Simply provide a prompt or
                  description, and watch as it generates high-quality visuals tailored to your
                  input.
                </IonCardSubtitle>
              </IonCardHeader>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default ArtiicialIntelligence;
