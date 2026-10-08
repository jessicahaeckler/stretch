import z from "zod";

export const CreateWorkoutSchema = z.object({
  name: z.string({ error: "Name is required" }).nonempty("Name is required"),
  description: z.string({ error: "Description must be a string" }),
  schedule_days: z.array(
    z.enum([
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ]),
    {
      error: "Please select a valid workout status.",
    },
  ),
  status: z.enum(["public", "private"], {
    error: "Please select a valid workout status.",
  }),
});

export type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;

export const WorkoutSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Please enter a workout name."),
  // exercises: z.array(
  //   z.object({
  //     id: z.nullable(z.string().optional()),
  //     exerciseId: z.string(),
  //     reps: z.nullable(z.number().optional()),
  //     time: z.nullable(z.string().optional()),
  //     rest: z.nullable(z.string().optional()),
  //   }),
  // ),
  description: z.string(),
  schedule_days: z.array(
    z.enum([
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ]),
  ),
  status: z.enum(["public", "private"], {
    error: "Please select a workout status.",
  }),
  date: z.string(),
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
