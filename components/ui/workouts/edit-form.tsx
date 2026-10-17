"use client";

import { WorkoutForm } from "@/resources/workouts/schemas/workout-validators";
import { Button } from "@/components/ui/button";
import ExerciseList from "@/components/ui/workouts/exercises/exercise-list";
import { Card, CardContent } from "@/components/ui/card";
import { editWorkout } from "@/resources/workouts/actions/edit-workout";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateWorkoutInput,
  CreateWorkoutSchema,
} from "@/resources/workouts/schemas/workout-validators";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRouter } from "next/navigation";
import { EditExerciseLinkInput } from "@/resources/exercises/schemas/exercise-validators";

export default function EditWorkoutForm({
  workout,
  links,
}: {
  workout: WorkoutForm;
  links: EditExerciseLinkInput[];
}) {
  // updated
  const router = useRouter();
  const form = useForm<CreateWorkoutInput>({
    resolver: zodResolver(CreateWorkoutSchema),
    defaultValues: {
      name: workout.name,
      description: workout.description ?? "",
      status: workout.status,
      schedule_days: workout.schedule_days ?? [],
    },
  });
  const { handleSubmit, formState, setError } = form;
  const submit = async (values: CreateWorkoutInput) => {
    const res = await editWorkout(workout.id, values);

    if (!res.success) {
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
          setError("schedule_days", { message: error });
      }
    }
  };
  return (
    <Card className="bg-gray-50 pt-6">
      <CardContent>
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <FieldGroup>
            <h2 className="mt-auto mb-auto text-lg font-bold">
              Workout Details
            </h2>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Workout Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    type="name"
                    placeholder="Workout name"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Workout Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-rhf-demo-title"
                    placeholder="Workout description"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Status</FieldLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-fit"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private">Private</Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public">Public</Label>
                    </div>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="schedule_days"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Schedule</FieldLabel>
                  <ToggleGroup
                    variant="outline"
                    value={field.value}
                    onValueChange={field.onChange}
                    multiple
                  >
                    <ToggleGroupItem value="sunday" aria-label="Toggle sunday">
                      Sunday
                    </ToggleGroupItem>
                    <ToggleGroupItem value="monday" aria-label="Toggle monday">
                      Monday
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="tuesday"
                      aria-label="Toggle tuesday"
                    >
                      Tuesday
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="wednesday"
                      aria-label="Toggle wednesday"
                    >
                      Wednesday
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="thursday"
                      aria-label="Toggle thursday"
                    >
                      Thursday
                    </ToggleGroupItem>
                    <ToggleGroupItem value="friday" aria-label="Toggle friday">
                      Friday
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="saturday"
                      aria-label="Toggle saturday"
                    >
                      Saturday
                    </ToggleGroupItem>
                  </ToggleGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-2">
              <Field orientation="horizontal">
                <Button type="submit" disabled={formState.isSubmitting}>
                  Save Workout
                </Button>
              </Field>
            </div>
          </FieldGroup>
        </form>

        <Separator className="mb-5 mt-5" />

        <ExerciseList workoutId={workout.id} exerciseLinks={links} />

        <Separator className="mb-5 mt-5" />

        <Field orientation="horizontal">
          <Button
            variant="outline"
            type="button"
            disabled={formState.isSubmitting}
            onClick={() => router.push("/dashboard/workouts")}
          >
            Done
          </Button>
        </Field>
      </CardContent>
    </Card>
  );
}
