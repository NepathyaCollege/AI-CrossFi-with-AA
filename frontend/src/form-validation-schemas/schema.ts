import * as Yup from "yup";

export const loginOrSignupValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
});

export const signupPasswordValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one capital letter")
    .matches(/[!?.@#$%^&*]/, "Password must contain at least one special character (!.?@#$%^&*)")
    .required("Password is required"),
});

export const loginValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one capital letter")
    .matches(/[!?.@#$%^&*]/, "Password must contain at least one special character (!.?@#$%^&*)")
    .required("Password is required"),
});

export const verifyEmailValidation = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one capital letter")
    .matches(/[!?.@#$%^&*]/, "Password must contain at least one special character (!.?@#$%^&*)")
    .required("Password is required"),
  code: Yup.string().required("Code is required").min(4, "Code must be 6 characters long"),
});
