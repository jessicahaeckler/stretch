import { WorkoutExerciseLink } from "@/app/lib/definitions";
import Link from "next/link";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createWorkout } from "@/app/lib/actions";
import { ScheduleDays } from "@/app/ui/workouts/exercises/day-picker";
import { ExercisePicker } from "@/app/ui/workouts/exercises/exercise-list";

export default function Form({
  exercises,
}: {
  exercises: WorkoutExerciseLink[];
}) {
  return (
    <form action={createWorkout}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Workout Name */}
        <div className="mb-4">
          <label htmlFor="workout" className="mb-2 block text-sm font-medium">
            Workout name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative flex gap-2">
              <div className="text-red-700 m-auto text-lg">*</div>
              <input
                id="workout"
                name="workout"
                type="text"
                required={true}
                placeholder="Enter workout"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm placeholder:text-gray-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Workout Exercise */}
        <div className="mb-4">
          <label htmlFor="exercise" className="mb-2 block text-sm font-medium">
            Choose exercise
          </label>
          <div className="mb-4 rounded-md border border-gray-200 bg-white px-[14px] py-3 overflow-auto w-full">
            <ExercisePicker exercises={exercises}></ExercisePicker>
          </div>
        </div>

        {/* Workout Schedule */}
        <fieldset className="min-w-0">
          <legend className="mb-2 block text-sm font-medium">
            Workout schedule
          </legend>
          <ScheduleDays></ScheduleDays>
        </fieldset>

        {/* Workout Status */}
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
                  defaultChecked={true}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-1"
                />
                <label
                  htmlFor="private"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Private <LockClosedIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="public"
                  name="status"
                  type="radio"
                  value="public"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-1"
                />
                <label
                  htmlFor="public"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Public <LockOpenIcon className="h-4 w-4" />
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
        <Button type="submit">Create Workout</Button>
      </div>
    </form>
  );
}
