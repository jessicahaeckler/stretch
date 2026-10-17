"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteExercise } from "@/resources/exercises/actions/delete-exercise";
import { useState } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditExerciseLinkInput,
  EditExerciseLinkSchema,
} from "@/resources/exercises/schemas/exercise-validators";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { AddExercise, UpdateExercise } from "@/components/ui/workouts/buttons";

export default function ExerciseList({
  workoutId,
  exerciseLinks,
}: {
  workoutId: string;
  exerciseLinks: EditExerciseLinkInput[];
}) {
  const form = useForm<EditExerciseLinkInput>({
    resolver: zodResolver(EditExerciseLinkSchema),
    defaultValues: {
      name: "",
      description: "",
      reps: 0,
      time: "0",
      rest: "0",
    },
  });

  return (
    <div>
      <div className="flex pb-5 justify-between">
        <h2 className="mt-auto mb-auto text-lg font-bold">
          Exercises ({exerciseLinks.length})
        </h2>
        <AddExercise id={workoutId} />
      </div>
      <div className="flex flex-col gap-2">
        {exerciseLinks.map((exercise) => (
          <Card key={exercise.name} className="bg-gray-50 pt-8">
            <CardContent>
              <FieldGroup>
                <div className="flex justify-between">
                  <div>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      <span>{exercise.name}</span>
                    </FieldLabel>
                    <FieldDescription>{exercise.description}</FieldDescription>
                  </div>
                  <div>
                    <UpdateExercise exerciseLink={exercise} />
                    <AlertDialogDelete
                      workoutId={workoutId}
                      exerciseId={exercise.exerciseId}
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Time
                        </FieldLabel>
                        <FieldDescription>{exercise.time}</FieldDescription>
                      </Field>
                    )}
                  />
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Reps
                        </FieldLabel>
                        <FieldDescription>{exercise.reps}</FieldDescription>
                      </Field>
                    )}
                  />
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Rest
                        </FieldLabel>
                        <FieldDescription>{exercise.rest}</FieldDescription>
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AlertDialogDelete({
  workoutId,
  exerciseId,
}: {
  workoutId: string;
  exerciseId: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deleteExercise(workoutId, exerciseId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete exercise:", error);
    } finally {
      setIsDeleting(false);
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="rounded-md border pl-1 pr-1 h-6 hover:bg-gray-200"
          >
            <span className="sr-only">Delete</span>
            <TrashIcon className="w-5" />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            exercise.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            {isDeleting ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
