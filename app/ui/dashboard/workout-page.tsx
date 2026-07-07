import { CalendarIcon } from "@heroicons/react/24/outline";
import { inter } from "@/app/ui/fonts";
import Image from "next/image";
import { fetchLatestWorkouts } from "@/app/lib/data";

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function WorkoutPage() {
  const workouts = await fetchLatestWorkouts();
  const chartHeight = 350;

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
        Workouts
      </h2>
      {/* NOTE: Uncomment this code in Chapter 7 */}

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-2 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-grey-500 p-4 md:gap-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="flex flex-col items-center gap-2 rounded-xl bg-white p-4"
            >
              <div className="w-full rounded-md bg-blue-300"></div>
              <Image
                src="/snail.jpg"
                width={1000}
                height={760}
                className="hidden md:block rounded-md"
                alt="A snail"
              />
              <p className="text-sm text-gray-500">{workout.name}</p>
              <p className="text-sm text-gray-400 p-4">{workout.username}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
