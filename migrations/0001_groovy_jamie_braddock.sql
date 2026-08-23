ALTER TABLE "account" ADD CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID");--> statement-breakpoint
ALTER TABLE "savedWorkout" ADD CONSTRAINT "savedWorkout_userId_workoutId_pk" PRIMARY KEY("userId","workoutId");--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token");--> statement-breakpoint
ALTER TABLE "workoutExerciseLink" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "workoutExerciseLink" ADD COLUMN "order" integer;--> statement-breakpoint
ALTER TABLE "workoutHistory" ADD COLUMN "id" text PRIMARY KEY NOT NULL;