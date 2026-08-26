import z from "zod";

export const ResetPasswordSchema = z
  .object({
    password: z
      .string({ error: "Password is required" })
      .nonempty("Password is required")
      .min(8, "Password must be more than 8 characters"),
    confirmPassword: z
      .string({ error: "Password is required" })
      .nonempty("Please confirm your password"),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "The passwords do not match.",
      path: ["confirmPassword"],
    },
  );

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
