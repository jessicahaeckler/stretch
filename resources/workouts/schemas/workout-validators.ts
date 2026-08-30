import z from "zod";

export const WorkoutSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Please enter a workout name."),
  exercises: z.array(
    z.object({
      id: z.nullable(z.string().optional()),
      exerciseId: z.string(),
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

export type WorkoutForm = {
  id: string;
  userId: string;
  name: string;
  days: (
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
  )[];
  duration: string | null;
  tags: string | null;
  image: string | null;
  status: "private" | "public";
};
