import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonImg,
  IonText,
  IonInput,
  IonButton,
  IonRow,
  IonCol,
  IonGrid,
  IonIcon,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import { arrowBackOutline } from "ionicons/icons";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";

import FormButton from "../../components/common/FormButton";
import FormError from "../../components/common/FormError";
import FormInput from "../../components/common/FormInput";
import { VERIFY_OTP, EMAIL_VERIFICATION_URL } from "../../config/apiUrl";
import { verifyEmailValidation } from "../../form-validation-schemas/schema";
import { ILocationState } from "../../interfaces/ILocationState";

const VerifyEmail: React.FC = () => {
  const history = useHistory();
  const location = useLocation<ILocationState>();
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);

  const formik = useFormik({
    initialValues: {
      email: location.state?.email || "",
      code: "",
      password: location.state?.password || "",
    },
    validationSchema: verifyEmailValidation,
    onSubmit: async (values, actions) => {
      try {
        const res = await axios.post(VERIFY_OTP, {
          email: values.email,
          password: values.password,
          otp: values.code,
        });

        if (res.status === 201) {
          history.replace("/home");
        }
      } catch (error: AxiosError | unknown) {
        if (axios.isAxiosError(error)) {
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

  const handleOtpResend = async (_event: React.MouseEvent<HTMLIonButtonElement>) => {
    if (resendDisabled) return; // Prevent resending if disabled

    try {
      const _res = await axios.post(EMAIL_VERIFICATION_URL, {
        email: formik.values.email,
        password: formik.values.password,
      });

      alert("OTP sent successfully");

      // Start the 60-second countdown
      setResendDisabled(true);
      setTimer(60);
    } catch (error: AxiosError | unknown) {
      if (axios.isAxiosError(error)) {
        formik.setStatus(
          error?.response?.data?.message || error.message || "An unexpected error occurred"
        );
      } else {
        formik.setStatus("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            clearInterval(interval);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendDisabled]);

  useEffect(() => {
    window.history.replaceState({}, "");
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid className="ion-padding h-full w-full">
          <IonRow className="ion-justify-content-between flex w-full justify-between gap-3">
            <IonCol size="auto" onClick={() => history.goBack()} className="cursor-pointer">
              <IonIcon className="text-4xl" icon={arrowBackOutline} />
            </IonCol>
            <IonCol size="auto">
              <IonImg className="h-10  w-16" src="AppLogo.svg" />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonText className="text-3xl font-semibold">Verify your email</IonText>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonText className="text-lg">
                Check your email inbox for a 6-digit verification code that we have sent and enter
                it below:
              </IonText>
            </IonCol>
          </IonRow>

          <form onSubmit={formik.handleSubmit}>
            <IonRow className="mt-8">
              <IonCol className="relative w-full">
                <FormInput
                  name="code"
                  type="code"
                  placeholder="CODE"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.code && formik.errors.code ? (
                  <FormError error={formik.errors.code} />
                ) : null}
                {formik.status && <FormError error={formik.status} />}
              </IonCol>
            </IonRow>

            <IonRow className="mb-6 w-full items-center">
              <IonCol size="8">
                <IonText className="my-4 text-start text-sm">
                  Didn’t get the email? check your spam and promotions, or resend.
                </IonText>
              </IonCol>
              <IonCol>
                <IonButton
                  className="ml-5 text-sm"
                  type="button"
                  fill="clear"
                  disabled={resendDisabled}
                  onClick={handleOtpResend}
                >
                  {resendDisabled ? `Resend in ${timer}s` : "Resend"}
                </IonButton>
              </IonCol>
            </IonRow>

            <IonRow className="w-full">
              <FormButton
                type="submit"
                showSpinner={formik.isSubmitting}
                disabled={formik.isSubmitting}
              >
                Continue
              </FormButton>
            </IonRow>
          </form>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default VerifyEmail;
