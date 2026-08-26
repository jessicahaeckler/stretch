import LatestExercises from "@/components/ui/dashboard/latest-exercises";
import Schedule from "@/components/ui/dashboard/schedule";
import { inter } from "@/components/ui/fonts";
import { fetchWeekSchedule } from "@/app/lib/data";
import { Suspense } from "react";
import WorkoutPage from "@/components/ui/dashboard/workout-page";
import { WorkoutSkeleton } from "@/components/ui/skeletons";

export default async function Page() {
  // const schedules = await fetchWeekSchedule();
  return (
    <div>Dash</div>
    // <main>
    //   <h1 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
    //     Schedule
    //   </h1>
    //   <Schedule Schedules={schedules} />
    //   <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
    //     <Suspense fallback={<WorkoutSkeleton />}>
    //       <WorkoutPage />
    //     </Suspense>
    //     <Suspense fallback={<WorkoutSkeleton />}>
    //       <LatestExercises />
    //     </Suspense>
    //   </div>
    // </main>
  );
}
