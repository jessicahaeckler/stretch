import Form from "@/components/ui/workouts/edit-form";
import Breadcrumbs from "@/components/ui/workouts/breadcrumbs";
import { notFound } from "next/navigation";
import { fetchExerciseLinksById } from "@/resources/exercises/queries/exercies-queries";
import { fetchWorkoutById } from "@/resources/workouts/queries/workout-queries";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const [workout, links] = await Promise.all([
    fetchWorkoutById(id),
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
      <Form workout={workout} links={links} />
    </main>
  );
}
