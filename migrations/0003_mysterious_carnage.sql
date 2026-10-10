ALTER TABLE "workoutExerciseLink" DROP CONSTRAINT "workoutExerciseLink_exerciseId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "workoutExerciseLink" ADD CONSTRAINT "workoutExerciseLink_exerciseId_exercises_id_fk" FOREIGN KEY ("exerciseId") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;