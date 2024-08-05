import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonImg, IonText, IonRow, IonCol, IonGrid } from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormButton from "../../components/common/FormButton";
import FormError from "../../components/common/FormError";
import FormInput from "../../components/common/FormInput";
import { CHECK_EMAIL_URL } from "../../config/apiUrl";
import SocialLogins from "../../components/SocialLogins";
import { loginOrSignupValidation } from "../../form-validation-schemas/schema";

const LoginOrSignup: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  // Initialize Formik
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: loginOrSignupValidation,
    onSubmit: async (values, actions) => {
      console.log(values);
      try {
        const res = await axios.post(CHECK_EMAIL_URL, {
          email: values.email,
        });

        let emailExist = res?.data?.emailExist;
        history.replace({ state: { email: values.email } });

        if (emailExist) {
          history.push("/login", { email: values.email });
        } else {
          history.push("/signup/email", {
            email: values.email,
            formData: values,
          });
        }
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

    const storedValues: any = location.state;

    console.log(location.state);
    if (storedValues) {
      console.log(storedValues);
      formik.setValues(storedValues);
    } else {
    }
  }, [location.state]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow className="h-screen items-center justify-center">
            <IonCol sizeXs="12" sizeSm="8" sizeMd="6" sizeLg="5" sizeXl="4" className="p-4">
              <IonGrid className="ion-margin-bottom">
                <IonCol size="auto">
                  <IonImg src={"AppLogo.svg"} alt="Logo" className="mx-auto w-[45%]" />
                </IonCol>
              </IonGrid>

              <IonRow className="mb-4 items-center justify-center">
                <IonText className="text-2xl font-semibold">Log in or sign up</IonText>
              </IonRow>

              <form onSubmit={formik.handleSubmit}>
                <IonRow className="mt-12">
                  <IonCol className="w-full">
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

                <IonRow className="mb-7 w-full">
                  <FormButton type="submit" disabled={formik.isSubmitting}>
                    Continue
                  </FormButton>
                </IonRow>
              </form>

              <SocialLogins />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default LoginOrSignup;
