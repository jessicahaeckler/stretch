"use client";

import {
  WorkoutExerciseLink,
  WorkoutExerciseLinkForm,
  WorkoutForm,
} from "@/app/lib/definitions";
import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { ScheduleDays } from "@/app/ui/workouts/exercises/day-picker";
import { ExercisePicker } from "@/app/ui/workouts/exercises/exercise-list";
import { updateWorkout } from "@/app/lib/actions";

export default function EditWorkoutForm({
  workout,
  exercises,
  links,
}: {
  workout: WorkoutForm;
  exercises: WorkoutExerciseLink[];
  links: WorkoutExerciseLinkForm[];
}) {
  const UpdateWorkoutWithId = updateWorkout.bind(null, workout.id);
  return (
    <form action={UpdateWorkoutWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Workout Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Workout name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={workout.name}
                placeholder="Enter name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm placeholder:text-gray-500 bg-white"
              />
            </div>
          </div>
        </div>

        <fieldset className="min-w-0">
          <legend className="mb-2 block text-sm font-medium">
            Workout schedule
          </legend>
          <ScheduleDays selectedDays={workout.schedule_days}></ScheduleDays>
        </fieldset>

        {/* TODO: fix this */}
        {/* Exercise Name */}
        <div className="mb-4">
          <label htmlFor="exercise" className="mb-2 block text-sm font-medium">
            Choose exercise
          </label>
          <div className="mb-4 rounded-md border border-gray-200 bg-white px-[14px] py-3 overflow-auto w-full">
            <ExercisePicker
              exercises={exercises}
              initialList={links}
            ></ExercisePicker>
          </div>
        </div>

        {/* workout Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the workout status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="private"
                  name="status"
                  type="radio"
                  value="private"
                  defaultChecked={workout.status === "private"}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="private"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Private <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="public"
                  name="status"
                  type="radio"
                  value="public"
                  defaultChecked={workout.status === "public"}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="public"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Public <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/workouts"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Workout</Button>
      </div>
    </form>
  );
}
