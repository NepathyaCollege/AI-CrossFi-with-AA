import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonPage,
  IonRow,
  IonText,
} from "@ionic/react";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { arrowBackOutline } from "ionicons/icons";
import React from "react";
import { useHistory, useLocation } from "react-router";
import FormButton from "../../components/common/FormButton";
import FormError from "../../components/common/FormError";
import FormInput from "../../components/common/FormInput";
import { CHECK_PASSWORD_URL } from "../../config/apiUrl";
import { loginValidation } from "../../form-validation-schemas/schema";

import { storeTokens } from "../../config/authTokens";

export interface ILocationState {
  email: string;
  password?: string;
}

const Login: React.FC = () => {
  const history = useHistory();
  const location = useLocation<ILocationState>();

  const formik = useFormik({
    initialValues: { email: location.state?.email || "", password: "" },
    validationSchema: loginValidation,
    onSubmit: async (values, actions) => {
      try {
        const res = await axios.post(CHECK_PASSWORD_URL, {
          email: values.email,
          password: values.password,
        });
        if (res.status === 200) {
          const { accessToken, refreshToken } = res.data.tokens;
          storeTokens(accessToken, refreshToken);

          history.replace("/home");
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

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid className="ion-padding h-full w-full  md:w-1/2 xl:w-1/3 2xl:[30%]  mx-auto  md:border md:border-zinc-800">
          <IonRow className="ion-justify-content-between flex w-full justify-between gap-3">
            <IonCol size="auto" onClick={() => history.goBack()} className="cursor-pointer">
              <IonIcon className="text-4xl" icon={arrowBackOutline} />
            </IonCol>
          </IonRow>

          {/* middle section */}
          <IonRow className="ion-justify-content-center  ion-align-items-center h-4/5 ">
            <IonGrid className="">
              <IonRow className="flex justify-center">
                <IonCol size="auto">
                  <IonImg className="h-20" src="AppLogo.svg" />
                </IonCol>
              </IonRow>

              {/* Form section */}

              <IonRow className="m-8">
                <IonCol size="12" className="w-full text-center">
                  <IonText className="text-ce text-2xl font-bold">
                    Sign in to your Nepathya DeFi Account
                  </IonText>
                </IonCol>
              </IonRow>

              <form onSubmit={formik.handleSubmit} className="flex flex-col">
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
                  </IonCol>
                </IonRow>

                <IonRow className="">
                  <IonCol className="relative w-full">
                    <FormInput
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <FormError error={formik.errors.password} />
                    ) : null}
                    {formik.status && <FormError error={formik.status} />}
                  </IonCol>
                </IonRow>

                <IonRow className="w-full">
                  <FormButton
                    type="submit"
                    showSpinner={formik.isSubmitting}
                    disabled={formik.isSubmitting}
                  >
                    Login
                  </FormButton>
                </IonRow>
              </form>
            </IonGrid>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
