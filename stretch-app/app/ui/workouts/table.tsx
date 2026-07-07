import Image from "next/image";
import { UpdateWorkout, DeleteWorkout } from "@/app/ui/workouts/buttons";
import WorkoutStatus from "@/app/ui/workouts/status";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { fetchFilteredWorkouts } from "@/app/lib/data";

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const workouts = await fetchFilteredWorkouts(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {workouts?.map((workout) => (
              <div
                key={workout.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src="/snail.jpg"
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${workout.name}'s profile picture`}
                      />
                      <p>{workout.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{workout.username}</p>
                  </div>
                  {/* <WorkoutStatus status={workout.status} /> */}
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">30:00</p>
                    <p>M/W/F</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateWorkout id={workout.id} />
                    <DeleteWorkout id={workout.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Workout
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  User
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Duration
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Schedule
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Adds
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {workouts?.map((workout) => (
                <tr
                  key={workout.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/snail2.jpeg"
                        className="mr-4 h-10 w-10 rounded-full aspect-square object-cover"
                        width={150}
                        height={150}
                        alt={`${workout.name}'s profile picture`}
                      />
                      <p>{workout.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {workout.username}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">10:00</td>
                  <td className="whitespace-nowrap px-3 py-3">M/W/F</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    20
                    {/* <WorkoutStatus status={workout.status} /> */}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateWorkout id={workout.id} />
                      <DeleteWorkout id={workout.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
