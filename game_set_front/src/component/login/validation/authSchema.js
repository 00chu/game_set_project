import * as yup from "yup";

export const signupSchema = yup.object().shape({
  nickname: yup.string().nullable(false).required("닉네임은 필수입니다"),

  email: yup
    .string()
    .nullable(false)
    .email("올바른 이메일 형식이 아닙니다")
    .required("이메일은 필수입니다"),

  password: yup
    .string()
    .nullable(false)
    .min(8, "비밀번호는 8자 이상")
    .required("비밀번호는 필수입니다"),

  passwordConfirm: yup
    .string()
    .nullable(false)
    // yup.ref("password") password 값 참조
    // .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다") password값과 같을 것
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다")
    .required("비밀번호 확인은 필수입니다"),

  // .oneOf([true], "이메일 인증이 필요합니다") 값이 무조건 true일 것
  isEmailVerified: yup.boolean().oneOf([true], "이메일 인증이 필요합니다"),
});
