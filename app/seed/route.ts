import bcrypt from "bcrypt";
import postgres from "postgres";
import {
  users,
  workouts,
  exercises,
  workout_exercise_links,
  schedules,
} from "../lib/placeholder-data";

const sql = postgres(process.env.STORAGE_POSTGRES_URL!, { ssl: "require" });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return sql`
        INSERT INTO users (id, username, email, password)
        VALUES (${user.id}, ${user.username}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedWorkouts() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`DELETE FROM workouts;`;
  await sql`Drop Table workouts;`;

  await sql`
    CREATE TABLE IF NOT EXISTS workouts (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      date_entered DATE NOT NULL,
      user_id UUID NOT NULL,
      name VARCHAR(255) NOT NULL,
      duration VARCHAR(255) NOT NULL,
      schedule_days VARCHAR(10)[],
      status VARCHAR(255) NOT NULL
    );
  `;

  const insertedWorkouts = await Promise.all(
    workouts.map(
      (workout) => sql`
        INSERT INTO workouts (id, date_entered, user_id, name, duration, schedule_days, status)
        VALUES (${workout.id}, ${workout.date_entered}, ${workout.user_id}, ${workout.name}, ${workout.duration}, ${workout.schedule_days}, ${workout.status})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedWorkouts;
}

async function seedExercises() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS exercises (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedExercise = await Promise.all(
    exercises.map(
      (exercise) => sql`
        INSERT INTO exercises (id, name, description, image_url)
        VALUES (${exercise.id}, ${exercise.name}, ${exercise.description}, ${exercise.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedExercise;
}

async function seedWorkoutExerciseLinks() {
  await sql`
    CREATE TABLE IF NOT EXISTS workout_exercise_links (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      workout_id UUID NOT NULL,
      exercise_id UUID NOT NULL,
      time VARCHAR(255),
      reps INT,
      rest VARCHAR(255)
    );
  `;

  const insertedLink = await Promise.all(
    workout_exercise_links.map(
      (links) => sql`
        INSERT INTO workout_exercise_links (id, workout_id, exercise_id, time, reps, rest)
        VALUES (DEFAULT, ${links.workout_id}, ${links.exercise_id}, ${links.time}, ${links.reps}, ${links.rest})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedLink;
}

async function seedSchedules() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`DELETE FROM schedules;`;

  await sql`
    CREATE TABLE IF NOT EXISTS schedules (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      workout_id UUID NOT NULL,
      status VARCHAR(255) NOT NULL,
      date_completed DATE NOT NULL
    );
  `;

  const insertedSchedules = await Promise.all(
    schedules.map(
      (schedule) => sql`
        INSERT INTO schedules (id, workout_id, status, date_completed)
        VALUES (${schedule.id}, ${schedule.workout_id}, ${schedule.status}, ${schedule.date_completed})
        ON CONFLICT (id) DO NOTHING;
      `,
    ),
  );

  return insertedSchedules;
}

export async function GET() {
  try {
    await sql`
      ALTER TABLE workout_exercise_links ALTER COLUMN rest DROP NOT NULL;
    `;
    await sql`
      ALTER TABLE workout_exercise_links ALTER COLUMN reps DROP NOT NULL;
    `;
    // const result = await sql.begin((sql) => [
    //   // seedUsers(),
    //   // seedWorkouts(),
    //   // seedExercises(),
    //   // seedWorkoutExerciseLinks(),
    //   // seedSchedules()
    // ]);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
