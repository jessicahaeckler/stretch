import CurrentWorkout from "@/app/ui/dashboard/current-workout";
import LatestExercises from "@/app/ui/dashboard/latest-exercises";
import Schedule from "@/app/ui/dashboard/schedule";
import { inter } from "@/app/ui/fonts";
import { fetchLatestExercises, fetchWeekSchedule } from "@/app/lib/data";
import { Suspense } from "react";
import WorkoutPage from "@/app/ui/dashboard/workout-page";
import { WorkoutSkeleton, LatestExercisesSkeleton } from "@/app/ui/skeletons";

export default async function Page() {
  const schedules = await fetchWeekSchedule();
  console.log("trying to load");
  return (
    <main>
      <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
        Schedule
      </h1>
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"> */}
      {/* <Card title="Collected" value={totalWorkouts} type="workouts" /> */}
      {/* <Card title="Pending" value={totalLikes} type="likes" /> */}
      {/* <Card title="Total Views" value={numberOfViews} type="views" /> */}
      {/* <Card title="Schedules" schedules={schedules} type="schedule" /> */}
      {/* </div> */}
      <Schedule Schedules={schedules} />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<WorkoutSkeleton />}>
          <WorkoutPage />
        </Suspense>
        <Suspense fallback={<WorkoutSkeleton />}>
          <LatestExercises />
        </Suspense>
      </div>
    </main>
  );
}
