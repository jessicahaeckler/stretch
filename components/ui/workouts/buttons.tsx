"use client";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteWorkout } from "@/resources/workouts/actions/delete-workout";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { editExercise } from "@/resources/exercises/actions/edit-exercise";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  type CreateExerciseLinkInput,
  CreateExerciseLinkSchema,
  EditExerciseLinkInput,
} from "@/resources/exercises/schemas/exercise-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { createExercise } from "@/resources/exercises/actions/create-exercise";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateWorkout() {
  return (
    <Link
      href="/dashboard/workouts/create"
      className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
    >
      <span className="hidden md:block">Create Workout</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
export function UpdateWorkout({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/workouts/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

// TODO:: add confirmation popup, add spinned and success message
export function DeleteWorkout({ id }: { id: string }) {
  const deleteWorkoutWithId = deleteWorkout.bind(null, id);
  return (
    <form action={deleteWorkoutWithId}>
      <Button
        type="submit"
        className="rounded-md border p-2 pl-3 pr-3 bg-red-700 hover:bg-red-600"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </Button>
    </form>
  );
}

export function AddExercise({ id }: { id: string }) {
  const router = useRouter();
  const [success, setSuccess] = useState("");
  const form = useForm<CreateExerciseLinkInput>({
    resolver: zodResolver(CreateExerciseLinkSchema),
    defaultValues: {
      name: "",
      description: "",
      time: "0",
      reps: 0,
      rest: "0",
    },
  });
  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: CreateExerciseLinkInput) => {
    const res = await createExercise(id, values);
    if (res.success) {
      router.refresh();
      setSuccess("Exercise added successfully.");
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.fieldErrors;

          for (const key of Object.keys(nestedErrors) as Array<
            keyof typeof nestedErrors
          >) {
            setError(key, {
              message: nestedErrors[key]?.[0],
            });
          }
          break;
        case 401:
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("rest", { message: error });
      }
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSuccess("");
        }
      }}
    >
      <DialogTrigger className="flex gap-1 p-2 pl-3 pr-3 font-bold bg-primary text-primary-foreground hover:bg-primary/80 transition-colors rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
        <PlusIcon />
        <span>Add Exercise</span>
      </DialogTrigger>

      <DialogContent>
        <form
          id="edit-user"
          onSubmit={handleSubmit(submit, (errors) => {
            console.log("Form validation failed:", errors);
          })}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Create Exercise</DialogTitle>
            <DialogDescription>
              Enter your exercise info below
            </DialogDescription>
            <Card className="bg-gray-50 pt-8">
              <CardContent>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input {...field} id="name" type="text" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {success && (
                          <p className="text-sm font-medium text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="description">
                          Description
                        </FieldLabel>
                        <Textarea {...field} id="description" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {success && (
                          <p className="text-sm font-medium text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="time">Time</FieldLabel>
                        <Input {...field} id="time" type="number" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {success && (
                          <p className="text-sm font-medium text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="reps"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reps">Reps</FieldLabel>
                        <Input
                          {...field}
                          id="reps"
                          type="number"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                            )
                          }
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {success && (
                          <p className="text-sm font-medium text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="rest"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="rest">Rest</FieldLabel>
                        <Input {...field} id="rest" type="number" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {success && (
                          <p className="text-sm font-medium text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </CardContent>
            </Card>
          </DialogHeader>
          <DialogFooter className="flex">
            <DialogClose
              className="grow"
              render={<Button type="button">Close</Button>}
            />
            <Button
              className="grow"
              type="submit"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting == true ? (
                <div>Creating...</div>
              ) : (
                <div>Create</div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function UpdateExercise({
  exerciseLink,
}: {
  exerciseLink: EditExerciseLinkInput;
}) {
  const router = useRouter();
  const [success, setSuccess] = useState("");
  const form = useForm<CreateExerciseLinkInput>({
    resolver: zodResolver(CreateExerciseLinkSchema),
    defaultValues: {
      name: exerciseLink.name,
      description: exerciseLink.description,
      time: exerciseLink.time,
      reps: exerciseLink.reps,
      rest: exerciseLink.rest,
    },
  });
  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: CreateExerciseLinkInput) => {
    console.log(values);
    const res = await editExercise(
      exerciseLink.exerciseId,
      exerciseLink.id,
      values,
    );
    if (res.success) {
      router.refresh();
      setSuccess("Exercise added successfully.");
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.fieldErrors;

          for (const key of Object.keys(nestedErrors) as Array<
            keyof typeof nestedErrors
          >) {
            setError(key, {
              message: nestedErrors[key]?.[0],
            });
          }
          break;
        case 401:
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("rest", { message: error });
      }
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSuccess("");
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="rounded-md border pl-1 pr-1 h-6 hover:bg-gray-200"
          >
            <span className="sr-only">Edit</span>
            <PencilIcon className="w-5" />
          </Button>
        }
      />

      <DialogContent>
        <form
          id="edit-exercise"
          onSubmit={handleSubmit(submit, (errors) => {
            console.log("Form validation failed:", errors);
          })}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
            <DialogDescription>
              Enter your exercise info below
            </DialogDescription>
            <Card className="bg-gray-50 pt-8">
              <CardContent>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input {...field} id="name" type="text" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {success && (
                          <p className="text-sm font-medium text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="description">
                          Description
                        </FieldLabel>
                        <Textarea {...field} id="description" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {success && (
                          <p className="text-sm font-medium text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="time"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="time">Time</FieldLabel>
                        <Input {...field} id="time" type="number" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {success && (
                          <p className="text-sm font-medium text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="reps"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reps">Reps</FieldLabel>
                        <Input
                          {...field}
                          id="reps"
                          type="number"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                            )
                          }
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {success && (
                          <p className="text-sm font-medium text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="rest"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="rest">Rest</FieldLabel>
                        <Input {...field} id="rest" type="number" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                        {success && (
                          <p className="text-sm font-medium text-green-600">
                            {success}
                          </p>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </CardContent>
            </Card>
          </DialogHeader>
          <DialogFooter className="flex">
            <DialogClose
              className="grow"
              render={<Button type="button">Close</Button>}
            />
            <Button
              className="grow"
              type="submit"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting == true ? (
                <div>Updating...</div>
              ) : (
                <div>Update</div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
