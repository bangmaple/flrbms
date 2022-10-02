import * as Yup from "yup";

export const SigninSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too short!')
    .max(50, 'Too long!')
    .required('Required!'),
  password: Yup.string()
    .min(2, 'Too short!')
    .max(50, 'Too long!')
    .required('Required!'),
});
