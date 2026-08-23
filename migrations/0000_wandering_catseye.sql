
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" text PRIMARY KEY NOT NULL,
	"dateEntered" timestamp NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savedWorkout" (
	"userId" text NOT NULL,
	"workoutId" text NOT NULL,
	"dateEntered" timestamp NOT NULL,
	"schedule_days" text
);
--> statement-breakpoint
CREATE TABLE "workoutExerciseLink" (
	"exerciseId" text NOT NULL,
	"workoutId" text NOT NULL,
	"dateEntered" timestamp NOT NULL,
	"time" text,
	"reps" integer,
	"rest" text
);
--> statement-breakpoint
CREATE TABLE "workoutHistory" (
	"userId" text NOT NULL,
	"workoutId" text NOT NULL,
	"dateEntered" timestamp NOT NULL,
	"completed" timestamp NOT NULL,
	"workoutName" text
);
--> statement-breakpoint
CREATE TABLE "workout" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"dateEntered" timestamp NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"duration" text NOT NULL,
	"days" integer,
	"status" text
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savedWorkout" ADD CONSTRAINT "savedWorkout_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savedWorkout" ADD CONSTRAINT "savedWorkout_workoutId_workout_id_fk" FOREIGN KEY ("workoutId") REFERENCES "public"."workout"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workoutExerciseLink" ADD CONSTRAINT "workoutExerciseLink_exerciseId_user_id_fk" FOREIGN KEY ("exerciseId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workoutExerciseLink" ADD CONSTRAINT "workoutExerciseLink_workoutId_workout_id_fk" FOREIGN KEY ("workoutId") REFERENCES "public"."workout"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workoutHistory" ADD CONSTRAINT "workoutHistory_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workoutHistory" ADD CONSTRAINT "workoutHistory_workoutId_workout_id_fk" FOREIGN KEY ("workoutId") REFERENCES "public"."workout"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout" ADD CONSTRAINT "workout_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint