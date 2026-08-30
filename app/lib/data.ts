import postgres from "postgres";
import {
  User,
  WorkoutUser,
  ScheduleWorkout,
  FullWorkoutUser,
} from "./definitions";

import { WorkoutForm } from "@/resources/workouts/schemas/workout-validators";

import {
  WorkoutExerciseLinkForm,
  WorkoutExerciseLink,
  Exercise,
} from "@/resources/exercises/schemas/exercise-validators";

const sql = postgres(process.env.STORAGE_POSTGRES_URL!, { ssl: "require" });

export async function getAuthUser(email: string) {
  try {
    const user = await sql<
      User[]
    >`SELECT * FROM users WHERE email=${email} AND password IS NOT NULL`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function createUser(email: string, name: string) {
  try {
    const user = await sql<User[]>`
      INSERT INTO users (email, username)
      VALUES (${email}, ${name})
      RETURNING *
    `;

    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchLatestWorkouts() {
  try {
    const data = await sql<WorkoutUser[]>`
      SELECT workouts.id, workouts.name, users.username
      FROM workouts
      JOIN users ON users.id = workouts.user_id
      ;`;

    const workouts = data.map((workout) => ({
      ...workout,
    }));
    return workouts;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest workouts.");
  }
}
export async function fetchLatestExercises() {
  try {
    const data = await sql<Exercise[]>`
      SELECT exercises.*
      FROM exercises limit 5;
      ;`;

    const exercises = data.map((exercise) => ({
      ...exercise,
    }));
    return exercises;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest exercises.");
  }
}
export async function fetchWeekSchedule() {
  try {
    const data = await sql<ScheduleWorkout[]>`
      SELECT schedules.id, workouts.name, schedules.status, schedules.date_completed
      FROM schedules 
      JOIN workouts ON workouts.id = schedules.workout_id
      WHERE date_completed >= current_date - EXTRACT(dow FROM current_date)::integer
      AND date_completed < current_date - EXTRACT(dow FROM current_date)::integer + 7;
    `;

    const schedules = data.map((schedule) => ({
      ...schedule,
    }));
    return schedules;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Failed to fetch the latest schedules. ${error}`);
  }
}

// export async function fetchFilteredCustomers(query: string) {
//   try {
//     const data = await sql<CustomersTableType[]>`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
// 	  `;

//     const customers = data.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));

//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }
