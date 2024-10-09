import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("無效的電子郵件地址"),
  password: z.string().min(6, "密碼至少需要6個字符"),
});

export const signupSchema = loginSchema
  .extend({
    username: z.string().min(3, "用戶名至少需要3個字符"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不匹配",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = loginSchema.pick({ email: true });
