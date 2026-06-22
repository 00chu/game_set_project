import * as yup from "yup";

export const signupSchema = yup.object().shape({
  nickname: yup
    .string()
    .trim()
    .required("닉네임을 입력해주세요")
    .min(2, "닉네임은 최소 2자 이상입니다")
    .max(10, "닉네임은 최대 10자까지 가능합니다")
    .matches(/^[가-힣a-zA-Z0-9]+$/, "닉네임은 한글, 영문, 숫자만 가능합니다"),

  email: yup
    .string()
    .trim()
    .required("이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),

  password: yup
    .string()
    .required("비밀번호를 입력해주세요")
    .min(8, "비밀번호는 최소 8자 이상입니다")
    .max(20, "비밀번호는 최대 20자까지 가능합니다")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*.,])[A-Za-z\d!@#$%^&*.,]{8,20}$/,
      "영문, 숫자, 특수문자를 포함해야 합니다",
    ),

  passwordConfirm: yup
    .string()
    .required("비밀번호 확인을 입력해주세요")
    .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다"),

  isEmailVerified: yup.boolean().oneOf([true], "이메일 인증이 필요합니다"),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),

  password: yup
    .string()
    .required("비밀번호를 입력해주세요")
    .min(8, "비밀번호는 최소 8자 이상입니다"),
});

export const findAccountSchema = yup.object().shape({
  email: yup
    .string()
    .required("이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),

  code: yup
    .string()
    .required("인증번호를 입력해주세요")
    .length(6, "인증번호는 6자리입니다")
    .matches(/^\d{6}$/, "숫자 6자리만 입력 가능합니다"),

  newPassword: yup
    .string()
    .required("새 비밀번호를 입력해주세요")
    .min(8, "비밀번호는 최소 8자 이상입니다")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*.,])[A-Za-z\d!@#$%^&*.,]{8,20}$/,
      "영문, 숫자, 특수문자를 포함해야 합니다",
    ),

  newPasswordConfirm: yup
    .string()
    .required("비밀번호 확인을 입력해주세요")
    .oneOf([yup.ref("newPassword")], "비밀번호가 일치하지 않습니다"),
});
