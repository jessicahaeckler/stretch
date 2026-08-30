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
