import postgres from 'postgres';

const sql = postgres(process.env.STORAGE_POSTGRES_URL!, { ssl: 'require' });

async function listExercises() {
// 	const data = await sql`
//     SELECT workouts.name, workout_exercise_links.time, workout_exercise_links.reps, workout_exercise_links.rest FROM workouts JOIN workout_exercise_links ON workouts.id = workout_exercise_links.workout_id;
//   `;

  // const data = await sql`
  //   SELECT * from schedules order by date_completed desc;
  // `;
  const data = await sql`
    SELECT * from schedules
    WHERE date_completed >= current_date - EXTRACT(dow FROM current_date)::integer
    AND date_completed < current_date - EXTRACT(dow FROM current_date)::integer + 7 order by date_completed desc;
  `;

	return data;
}

export async function GET() {
//   return Response.json({
//     message:
//       'Uncomment this file and remove this line. You can delete this file when you are finished.',
//   });
  try {
  	return Response.json(await listExercises());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}