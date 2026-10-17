import z from "zod";

export const CreateExerciseLinkSchema = z.object({
  name: z.string({ error: "Name is required" }).nonempty("Name is required"),
  description: z.string({ error: "Description must be a string" }),
  time: z.string({ error: "time should be text" }),
  reps: z.number({ error: "reps should be a number" }),
  rest: z.string({ error: "rest should be text" }),
});

export type CreateExerciseLinkInput = z.infer<typeof CreateExerciseLinkSchema>;

export const EditExerciseLinkSchema = z.object({
  id: z.string(),
  name: z.string({ error: "Name is required" }).nonempty("Name is required"),
  description: z.string({ error: "Description must be a string" }),
  time: z.string({ error: "time should be text" }),
  reps: z.number({ error: "reps should be a number" }),
  rest: z.string({ error: "rest should be text" }),
  order: z.number(),
  exerciseId: z.string(),
});

export type EditExerciseLinkInput = z.infer<typeof EditExerciseLinkSchema>;

export const ExerciseLinkSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Please enter a exercise name."),
  description: z.string(),
  dateEntered: z.string(),
  time: z.string(),
  reps: z.number(),
  rest: z.string(),
  order: z.number(),
  workoutId: z.string(),
});

export type Exercise = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
};

export type WorkoutExerciseLinkForm = {
  id?: string;
  exerciseId: string;
  time: string | null;
  reps: number | null;
  rest: string | null;
};

export type WorkoutExerciseLink = {
  id: string;
  workout_id: string;
  exercise_id: string;
  name: string | null;
  time: string | null;
  reps: number | null;
  rest: string | null;
};
