CREATE TYPE "public"."days" AS ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('public', 'private');--> statement-breakpoint
ALTER TABLE "savedWorkout" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "savedWorkout" CASCADE;--> statement-breakpoint
ALTER TABLE "workoutHistory" DROP CONSTRAINT "workoutHistory_workoutId_workout_id_fk";
--> statement-breakpoint
ALTER TABLE "workoutHistory" ALTER COLUMN "workoutId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "workout" ALTER COLUMN "duration" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "workout" ALTER COLUMN "status" SET DEFAULT 'private'::"public"."status";--> statement-breakpoint
ALTER TABLE "workout" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "workout" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "workout" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "workout" ADD COLUMN "schedule_days" "days"[] NOT NULL;--> statement-breakpoint
ALTER TABLE "workout" ADD COLUMN "parentWorkoutId" text;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workoutHistory" ADD CONSTRAINT "workoutHistory_workoutId_workout_id_fk" FOREIGN KEY ("workoutId") REFERENCES "public"."workout"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workout" ADD CONSTRAINT "workout_parentWorkoutId_workout_id_fk" FOREIGN KEY ("parentWorkoutId") REFERENCES "public"."workout"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "workout" DROP COLUMN "days";