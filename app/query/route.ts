import postgres from "postgres";

const sql = postgres(process.env.STORAGE_POSTGRES_URL!, { ssl: "require" });

async function listExercises() {
  // 	const data = await sql`
  //     SELECT workouts.name, workout_exercise_links.time, workout_exercise_links.reps, workout_exercise_links.rest FROM workouts JOIN workout_exercise_links ON workouts.id = workout_exercise_links.workout_id;
  //   `;

  // const data = await sql`
  //   SELECT * from schedules order by date_completed desc;
  // `;
  const data = await sql`
    SELECT * from users;
  `;

  return data;
}

export async function GET() {
  try {
    return Response.json(await listExercises());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
