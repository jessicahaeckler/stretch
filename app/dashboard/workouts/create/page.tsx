import Form from "@/components/ui/workouts/create-form";
import Breadcrumbs from "@/components/ui/workouts/breadcrumbs";
import { fetchUserExercises } from "@/resources/exercises/queries/exercies-queries";

export default async function Page() {
  // TODO: add pagination
  const exercises = await fetchUserExercises(1);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Workouts", href: "/dashboard/workouts" },
          {
            label: "Create Workout",
            href: "/dashboard/workouts/create",
            active: true,
          },
        ]}
      />
      <Form exercises={exercises} />
    </main>
  );
}
