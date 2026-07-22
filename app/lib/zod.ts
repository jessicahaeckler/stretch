import z from "zod";

export const signInSchema = z.object({
  email: z.email({ error: "Email is required" }).min(1, "Email is required"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const WorkoutSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Please enter a workout name."),
  exercises: z.array(
    z.object({
      id: z.nullable(z.string().optional()),
      exerciseid: z.string(),
      reps: z.nullable(z.number().optional()),
      time: z.nullable(z.string().optional()),
      rest: z.nullable(z.string().optional()),
    }),
  ),
  schedule: z.array(z.string()),
  status: z.enum(["public", "private"], {
    error: "Please select a workout status.",
  }),
  date: z.string(),
  deletedExercises: z.array(z.string()).optional(),
});
