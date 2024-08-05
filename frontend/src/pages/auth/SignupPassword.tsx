import React, { useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonImg,
  IonText,
  IonRow,
  IonCol,
  IonGrid,
  IonIcon,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import { arrowBackOutline } from "ionicons/icons";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import FormInput from "../../components/common/FormInput";
import FormError from "../../components/common/FormError";
import FormButton from "../../components/common/FormButton";
import { EMAIL_VERIFICATION_URL } from "../../config/apiUrl";
import { signupPasswordValidation } from "../../form-validation-schemas/schema";
import { ILocationState } from "../../interfaces/ILocationState";

const SignupPassword: React.FC = () => {
  const history = useHistory();
  const location = useLocation<ILocationState>();

  const formik = useFormik({
    initialValues: { email: location.state?.email || "", password: "" },
    validationSchema: signupPasswordValidation,
    onSubmit: async (values, actions) => {
      console.log(values);
      // return;
      try {
        const res = await axios.post(EMAIL_VERIFICATION_URL, {
          email: values.email,
          password: values.password,
        });

        if (res.status === 201) {
          history.replace({
            state: { email: values.email, password: values.password },
          });
          history.push("/signup/verifyEmail", {
            email: values.email,
            password: values.password,
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
              <IonImg className="h-10 w-16" src="AppLogo.svg" />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonText className="text-3xl font-semibold">Set Your Password</IonText>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonText className="text-lg">
                Add a way to protect your account. Set a password that nobody can guess. 😉
              </IonText>
            </IonCol>
          </IonRow>

          <form onSubmit={formik.handleSubmit}>
            <IonRow className="mt-8">
              <IonCol className="w-full">
                <FormInput
                  name="email"
                  type="email"
                  readonly={true}
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

            <IonRow className="mt-8">
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

            <IonRow className="mb-6 w-full">
              <IonCol>
                <IonText className="mx-4 text-start text-sm">
                  <ul className="list-inside list-disc space-y-1">
                    <li>Must contain at least 8 characters</li>
                    <li>At least one number</li>
                    <li>At least one capital letter</li>
                    <li>At least one of these symbols: !.?@#$%^&*</li>
                  </ul>
                </IonText>
              </IonCol>
            </IonRow>

            <IonRow className="w-full">
              <FormButton type="submit" disabled={formik.isSubmitting}>
                Continue
              </FormButton>
            </IonRow>
          </form>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default SignupPassword;
