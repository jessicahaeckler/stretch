import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchWorkouts } from "@/app/lib/data";

export default async function Page() {
  const workouts = await fetchWorkouts();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Workouts", href: "/dashboard/invoices" },
          {
            label: "Create Workout",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <Form workouts={workouts} />
    </main>
  );
}
