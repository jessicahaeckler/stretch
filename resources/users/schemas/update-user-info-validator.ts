import z from "zod";

export const UpdateUserInfoSchema = z.object({
  id: z.uuid("Your id must be a valid UUID."),
  name: z
    .string("Your name must be text")
    .trim()
    .min(1, "Please enter your name."),
});

export type UpdateUserInfoInput = z.infer<typeof UpdateUserInfoSchema>;
