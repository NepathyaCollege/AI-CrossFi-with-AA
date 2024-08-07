import {
  IonButton,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonInput,
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";

import FormButton from "../../components/common/FormButton";
import FormError from "../../components/common/FormError";
import FormInput from "../../components/common/FormInput";
import { CHECK_EMAIL_URL } from "../../config/apiUrl";
import { loginOrSignupValidation } from "../../form-validation-schemas/schema";
import { ILocationState } from "../../interfaces/ILocationState";

const SignupEmail: React.FC = () => {
  const history = useHistory();

  const location = useLocation<ILocationState>();
  // history.location.state = location.state;

  const formik = useFormik({
    initialValues: { email: location.state?.email || "" },
    validationSchema: loginOrSignupValidation,
    onSubmit: async (values, actions) => {
      console.log(values);
      try {
        const res = await axios.post(CHECK_EMAIL_URL, {
          email: values.email,
        });

        let emailExist = res?.data?.emailExist;
        const targetPath = emailExist ? "/login" : "/signup/password";
        history.replace({ state: { email: values.email } });
        history.push(targetPath, { email: values.email });
      } catch (error: AxiosError | unknown) {
        if (axios.isAxiosError(error)) {
          console.log(error);
          actions.setStatus(
            error?.response?.data?.message || error.message || "An unexpected error occurred"
          );
        } else {
          actions.setStatus("An unexpected error occurred");
        }
      }
      actions.setSubmitting(false);
    },
  });

  useEffect(() => {
    window.history.replaceState({}, "");
  }, []);
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid className="ion-padding grid h-full w-full gap-2">
          <IonRow className="ion-justify-content-between flex w-full justify-between gap-3">
            <IonCol size="auto" onClick={() => history.goBack()} className="cursor-pointer">
              <IonIcon className="text-3xl" icon={arrowBackOutline} />
            </IonCol>
            <IonCol size="auto">
              <IonImg className="h-8 w-auto" src="AppLogo.svg" />
            </IonCol>
          </IonRow>

          <IonRow className="flex justify-center">
            <IonCol size="auto">
              <IonImg className="h-28 w-auto" src="AppLogo.svg" />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonText className="text-2xl font-bold text-center w-full">
              Create Your Nepathya Account
            </IonText>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonText className="text-md font-medium opacity-50">
                This email address doesn't have a Nepathya account yet. Let's create one now!
                <br />
                It only takes a minute to get started 🥳
              </IonText>
            </IonCol>
          </IonRow>

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            <IonRow>
              <IonCol size="12">
                <FormInput
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <FormError error={formik.errors.email} />
                ) : null}
                {formik.status && <FormError error={formik.status} />}
              </IonCol>
            </IonRow>

            <IonRow className="mb-2 mt-2 px-1">
              <FormButton
                type="submit"
                showSpinner={formik.isSubmitting}
                disabled={formik.isSubmitting}
              >
                Continue
              </FormButton>
            </IonRow>
          </form>

          <IonRow>
            <IonCol className="ion-padding text-center text-xs opacity-40">
              <IonText className="font-medium">
                By Clicking “Continue”, you acknowledge that you have read and understood, and agree
                to Nepathya Defi's Privacy Policy.
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SignupEmail;
