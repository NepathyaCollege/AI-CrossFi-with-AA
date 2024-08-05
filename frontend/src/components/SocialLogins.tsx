import { IonRow, IonCol, IonText, IonButton, IonImg } from "@ionic/react";

const SocialLogins: React.FC = () => {
  return (
    <>
      {/* line break through */}
      <IonRow class="flex items-center justify-center gap-2">
        <IonCol class="w-10 shrink border border-gray-800"></IonCol>
        <IonCol class="grow whitespace-nowrap text-center text-xs">
          <IonText>OR CONTINUE WITH</IonText>
        </IonCol>
        <IonCol class="w-10 shrink border border-gray-800"></IonCol>
      </IonRow>

      {/* google/facebook buttons */}

      <IonRow className="mt-8 flex gap-3 px-4">
        <IonCol className="">
          <IonButton
            fill="clear"
            color="dark"
            className="w-full rounded-md border border-gray-700 bg-[rgb(13,13,13)] py-1 text-base capitalize tracking-wider"
          >
            <IonImg className="mr-1 inline-block h-4 w-4" src="AppLogo.svg" />
            <IonText>Google</IonText>
          </IonButton>
        </IonCol>

        <IonCol className="">
          <IonButton
            fill="clear"
            color="dark"
            className="w-full rounded-md border border-gray-700 bg-[rgb(13,13,13)] py-1 text-base capitalize tracking-wider"
          >
            <IonImg className="mr-1 inline-block h-4 w-4" src="AppLogo.svg" />
            <IonText>Facebook</IonText>
          </IonButton>
        </IonCol>
      </IonRow>

      {/* show more options */}

      <IonRow className="mt-8 items-center justify-center">
        <IonButton
          fill="clear"
          color="dark"
          className="w-fit rounded-md border border-gray-700 bg-[rgb(13,13,13)] px-6 py-1 text-base capitalize tracking-wider"
        >
          <IonText>Show more options</IonText>
        </IonButton>
      </IonRow>
    </>
  );
};

export default SocialLogins;
