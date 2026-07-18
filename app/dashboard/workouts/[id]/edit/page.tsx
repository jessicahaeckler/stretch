import Form from "@/app/ui/workouts/edit-form";
import Breadcrumbs from "@/app/ui/workouts/breadcrumbs";
import { notFound } from "next/navigation";
import {
  fetchExercises,
  fetchWorkoutById,
  fetchExerciseLinksById,
} from "@/app/lib/data";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [workout, exercises, links] = await Promise.all([
    fetchWorkoutById(id),
    fetchExercises(),
    fetchExerciseLinksById(id),
  ]);
  if (!workout) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Workouts", href: "/dashboard/workouts" },
          {
            label: "Edit Workout",
            href: `/dashboard/workouts/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form workout={workout} exercises={exercises} links={links} />
    </main>
  );
}
