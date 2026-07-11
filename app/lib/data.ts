import postgres from 'postgres';
import {
  User,
  WorkoutUser,
  Exercise,
  WorkoutExerciseLink,
  ScheduleWorkout,
  FullWorkoutUser
} from './definitions';

const sql = postgres(process.env.STORAGE_POSTGRES_URL!, { ssl: 'require' });

export async function fetchUser() {
  try {
    const data = await sql<User[]>`SELECT * FROM user`;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestWorkouts() {
  try {
    const data = await sql<WorkoutUser[]>`
      SELECT workouts.id, workouts.name, users.username
      FROM workouts
      JOIN users ON users.id = workouts.user_id
      ;`;


    // `SELECT workouts.name as workout_name, users.name as user_name
    //   FROM workouts
    //   JOIN users ON users.id = workouts.user_id;`;

    const workouts = data.map((workout) => ({
      ...workout
    }));
    return workouts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest workouts.');
  }
}
export async function fetchLatestExercises() {
  try {
    const data = await sql<Exercise[]>`
      SELECT exercises.*
      FROM exercises limit 5;
      ;`;

    const exercises = data.map((exercise) => ({
      ...exercise
    }));
    return exercises;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest exercises.');
  }
}
export async function fetchWeekSchedule() {
  const curr_date = new Date();
  const sunday = curr_date.getDate() - curr_date.getDay();
  const begin_date = new Date(curr_date.setDate(sunday));
  const end_date = new Date(curr_date.setDate(sunday + 6));
  try {
    const data = await sql<ScheduleWorkout[]>`
      SELECT schedules.id, workouts.name, schedules.status, schedules.date_completed
      FROM schedules 
      JOIN workouts ON workouts.id = schedules.workout_id
      WHERE date_completed >= current_date - EXTRACT(dow FROM current_date)::integer
      AND date_completed < current_date - EXTRACT(dow FROM current_date)::integer + 7;
    `;

    const schedules = data.map((schedule) => ({
      ...schedule
    }));
    return schedules;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch the latest schedules. ${error}`);
  }
}

// export async function fetchCardData() {
//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
//     const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
//     const invoiceStatusPromise = sql`SELECT
//          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
//          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
//          FROM invoices`;

//     const data = await Promise.all([
//       invoiceCountPromise,
//       customerCountPromise,
//       invoiceStatusPromise,
//     ]);

//     const numberOfInvoices = Number(data[0][0].count ?? '0');
//     const numberOfCustomers = Number(data[1][0].count ?? '0');
//     const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
//     const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

//     return {
//       numberOfCustomers,
//       numberOfInvoices,
//       totalPaidInvoices,
//       totalPendingInvoices,
//     };
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch card data.');
//   }
// }

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredWorkouts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const workouts = await sql<FullWorkoutUser[]>`
      SELECT
        workouts.id,
        workouts.user_id,
        workouts.name,
        workouts.schedule_days,
        workouts.duration,
        users.username
      FROM workouts
      JOIN users ON workouts.user_id = users.id
      WHERE
        users.username ILIKE ${`%${query}%`} OR
        workouts.name ILIKE ${`%${query}%`} 
      ORDER BY workouts.name DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return workouts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch workouts.');
  }
}

export async function fetchWorkoutsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM workouts
    JOIN users ON workouts.user_id = users.id
    WHERE
      users.username ILIKE ${`%${query}%`} OR
      workouts.name ILIKE ${`%${query}%`} 
    `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of workouts.');
  }
}

// export async function fetchInvoiceById(id: string) {
//   try {
//     const data = await sql<InvoiceForm[]>`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM invoices
//       WHERE invoices.id = ${id};
//     `;

//     const invoice = data.map((invoice) => ({
//       ...invoice,
//       // Convert amount from cents to dollars
//       amount: invoice.amount / 100,
//     }));

//     return invoice[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoice.');
//   }
// }

export async function fetchExercises() {
  try {
    const exercises = await sql<WorkoutExerciseLink[]>`
      SELECT
        id,
        name
      FROM exercises
      ORDER BY name ASC
    `;

    return exercises;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all exercises.');
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