import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  type AnyPgColumn,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { SQL, sql } from "drizzle-orm";

// custom lower function
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export const roleEnum = pgEnum("role", ["standard", "admin"]);
export const statusEnum = pgEnum("status", ["public", "private"]);
export const daysEnum = pgEnum("days", [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]);

export const users = pgTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    password: text("password"),
    role: roleEnum("role").notNull().default("standard"),
  },
  (table) => ({
    emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(lower(table.email)),
  }),
);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ],
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  ],
);

export const workouts = pgTable("workout", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  dateEntered: timestamp("dateEntered", { mode: "date" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  duration: text("duration"),
  status: statusEnum("status").notNull().default("private"),
  tags: text("tags"),
  schedule_days: daysEnum("schedule_days").array().notNull(),
  parentWorkoutId: text("parentWorkoutId").references(
    (): AnyPgColumn => workouts.id,
    { onDelete: "set null" },
  ),
});

export const exercises = pgTable("exercises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  dateEntered: timestamp("dateEntered", { mode: "date" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
});

export const workoutExerciseLinks = pgTable("workoutExerciseLink", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  exerciseId: text("exerciseId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  workoutId: text("workoutId")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  dateEntered: timestamp("dateEntered", { mode: "date" }).notNull(),
  time: text("time"),
  reps: integer("reps"),
  rest: text("rest"),
  order: integer("order"),
});

export const workoutHistory = pgTable("workoutHistory", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  workoutId: text("workoutId").references(() => workouts.id, {
    onDelete: "set null",
  }),
  dateEntered: timestamp("dateEntered", { mode: "date" }).notNull(),
  completed: timestamp("completed", { mode: "date" }).notNull(),
  workoutName: text("workoutName"),
});
