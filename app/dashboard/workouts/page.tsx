import Pagination from "@/app/ui/workouts/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/workouts/table";
import { CreateWorkout } from "@/app/ui/workouts/buttons";
import { inter } from "@/app/ui/fonts";
import { WorkoutsTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchWorkoutsPages } from "@/app/lib/data";

// this page will display workouts you have created or saved from other users.
// editing another users workout creates a new copy.
// deleting another users workout removes the workout from your "saved" workouts.

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchWorkoutsPages(query);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${inter.className} text-2xl`}>My Workouts</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search workouts..." />
        <CreateWorkout />
      </div>
      <Suspense key={query + currentPage} fallback={<WorkoutsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
