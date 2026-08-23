import z from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.email({ error: "Email is required" }).min(1, "Email is required"),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
