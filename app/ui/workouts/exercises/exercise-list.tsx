"use client";
import { useState } from "react";
import {
  WorkoutExerciseLink,
  WorkoutExerciseLinkForm,
} from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";
import { ClockIcon, HashtagIcon, MoonIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export function ExercisePicker({
  exercises,
  initialList,
}: {
  exercises: WorkoutExerciseLink[];
  initialList?: WorkoutExerciseLinkForm[];
}) {
  const [selected, setSelected] = useState<WorkoutExerciseLinkForm[]>(
    initialList ?? [],
  );
  const [current, setCurrent] = useState<Partial<WorkoutExerciseLinkForm>>({});
  const [trackingKey, setTrackingKey] = useState(0);
  const [deleted, setDeleted] = useState<String[]>([]);

  function handleAdd() {
    if (!current.exerciseid) return; // guard against empty add
    setSelected((prev) => [...prev, current as WorkoutExerciseLinkForm]);
    setCurrent({});
    setTrackingKey((k) => k + 1);
  }

  function handleRemove(index: number) {
    if (selected[index]?.id) {
      setDeleted((prev) => [...prev, selected[index]?.id as String]);
    }
    setSelected((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      {/* hidden input carries the real payload to the server action */}
      <input type="hidden" name="exercises" value={JSON.stringify(selected)} />
      <input
        type="hidden"
        name="deletedExercises"
        value={JSON.stringify(deleted)}
      />

      <select
        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-2 text-sm placeholder:text-gray-500 mb-4"
        value={current.exerciseid ?? ""}
        onChange={(e) =>
          setCurrent((c) => ({ ...c, exerciseid: e.target.value }))
        }
      >
        <option value="" disabled>
          Select an exercise
        </option>
        {exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>

      <ExerciseTracking
        key={trackingKey}
        onChange={(fields) => setCurrent((c) => ({ ...c, ...fields }))}
      />

      <div className="w-full flex justify-center">
        <Button type="button" color="green" onClick={handleAdd}>
          + Add Exercise
        </Button>
      </div>

      <ul className="divide-y divide-gray-200">
        {selected.map((ex, i) => (
          <li className="py-2 flex items-center justify-between" key={i}>
            <div className="grow m-auto flex gap-2">
              {exercises.find((e) => e.id === ex.exerciseid)?.name}
              <label
                className={clsx(
                  "ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600",
                  {
                    hidden: !ex?.reps,
                  },
                )}
              >
                {ex?.reps} reps <HashtagIcon className="h-4 w-4" />
              </label>
              <label
                className={clsx(
                  "ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600",
                  {
                    hidden: !ex?.rest,
                  },
                )}
              >
                {ex?.rest} rest <MoonIcon className="h-4 w-4" />
              </label>
              <label
                className={clsx(
                  "ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600",
                  {
                    hidden: !ex?.time,
                  },
                )}
              >
                {ex?.time} time <ClockIcon className="h-4 w-4" />
              </label>
            </div>
            <Button
              className="m-[2px]"
              color="red"
              type="button"
              onClick={() => handleRemove(i)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type ExerciseFields = {
  reps?: number;
  time?: string;
  rest?: string;
};

type ExerciseTrackingProps = {
  onChange?: (fields: ExerciseFields) => void;
};

export function ExerciseTracking({ onChange }: ExerciseTrackingProps) {
  const [timing, setTiming] = useState<"reps" | "timed">("reps");
  const [showRest, setShowRest] = useState<boolean>(true);
  const [reps, setReps] = useState<number>();
  const [time, setTime] = useState<string>();
  const [rest, setRest] = useState<string>();

  function emit(overrides: Partial<ExerciseFields> = {}) {
    onChange?.({
      reps: timing == "reps" ? reps : undefined,
      time: timing == "timed" ? time : undefined,
      rest: showRest ? rest : undefined,
      ...overrides,
    });
  }

  return (
    <div className="items-center flex gap-2 mb-4 md:flex-row flex-col overflow-scroll pl-2">
      <div className="flex items-center">
        <input
          id="showReps"
          name="showReps"
          type="radio"
          value="reps"
          className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-1"
          checked={timing === "reps"}
          onChange={(e) => {
            const value = e.target.value as "reps" | "timed";
            setTiming(value);
            emit({ reps: value == "reps" ? reps : undefined });
          }}
        />
        <label
          htmlFor="showReps"
          className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
        >
          Reps <HashtagIcon className="h-4 w-4" />
        </label>
      </div>

      <div className="flex items-center">
        <input
          id="showTimed"
          name="showTimed"
          type="radio"
          value="timed"
          className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-1"
          checked={timing === "timed"}
          onChange={(e) => {
            const value = e.target.value as "reps" | "timed";
            setTiming(value);
            emit({ time: value == "timed" ? time : undefined });
          }}
        />
        <label
          htmlFor="showTimed"
          className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
        >
          Timed <ClockIcon className="h-4 w-4" />
        </label>
      </div>

      {timing === "reps" && (
        <div className="relative min-w-30">
          <input
            id="reps"
            name="reps"
            type="number"
            min="0"
            placeholder="Enter Reps"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-2 text-sm"
            value={reps ?? ""}
            onChange={(e) => {
              const value =
                e.target.value === "" ? undefined : Number(e.target.value);
              setReps(value);
              emit({ reps: value });
            }}
          />
          <HashtagIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px]" />
        </div>
      )}
      {/* use custom time input, this is temporary */}
      {timing === "timed" && (
        <div className="relative">
          <input
            id="time"
            name="time"
            type="time"
            step="1"
            min="0"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-2 text-sm placeholder:text-gray-500"
            value={time ?? ""}
            onChange={(e) => {
              setTime(e.target.value);
              emit({ time: e.target.value });
            }}
          />
          <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      )}
      <div className="flex items-center">
        <input
          id="showRest"
          name="showRest"
          type="checkbox"
          className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-1"
          checked={showRest}
          onChange={(e) => {
            setShowRest(e.target.checked);
            emit({ rest: e.target.checked ? rest : undefined });
          }}
        />
        <label
          htmlFor="showRest"
          className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
        >
          Rest <MoonIcon className="h-4 w-4" />
        </label>
      </div>

      {showRest === true && (
        <div className="relative">
          <input
            id="rest"
            name="rest"
            type="time"
            step="1"
            min="0"
            placeholder="Enter Rest"
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-2 text-sm placeholder:text-gray-500"
            value={rest ?? ""}
            onChange={(e) => {
              setRest(e.target.value);
              emit({ rest: e.target.value });
            }}
          />
          <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
      )}
    </div>
  );
}
