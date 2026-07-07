// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  streak: number;
};

export type Workout = {
  id: string;
  user_id: string;
  name: string;
  duration: string;
  schedule_days: string;
  start_date: Date;
  workout_streak: number;
};

export type FullWorkoutUser = {
  id: string;
  user_id: string;
  name: string;
  // duration: string;
  // schedule_days: string;
  // start_date: Date;
  // workout_streak: number;
  duration: string;
  schedule_days: string;
  username: string;
};

export type WorkoutUser = {
  id: string;
  name: string;
  username: string;
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
  image_url: string;
};

export type WorkoutExerciseLink = {
  id: string;
  workout_id: string;
  exercise_id: string;
  time: string;
  reps: number;
  rest: string;
};

export type Schedule = {
  id: string;
  workout_id: string;
  status: 'COMPLETED' | 'SCHEDULED' | 'MISSED';
  date_completed: string;
};


export type ScheduleWorkout = {
  id: string;
  name: string;
  status: 'COMPLETED' | 'SCHEDULED' | 'MISSED';
  date_completed: Date;
};