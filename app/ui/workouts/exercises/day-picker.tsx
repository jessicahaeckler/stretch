"use client";

import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { HashtagIcon, ClockIcon, MoonIcon } from "@heroicons/react/24/outline";

export function Day({ day }: { day: string }) {
  return (
    <div className="flex items-center">
      <input
        id={day}
        name="schedule"
        type="checkbox"
        value={day}
        className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-1"
      />
      <label
        htmlFor={day}
        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
      >
        {day} <CalendarDaysIcon className="h-4 w-4" />
      </label>
    </div>
  );
}
