import z from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string({ error: "Name must be text" })
      .min(6, "Name must be more than 6 characters")
      .optional()
      .or(z.literal("")),
    email: z
      .email({ error: "Email is required" })
      .nonempty("Email is required"),
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
