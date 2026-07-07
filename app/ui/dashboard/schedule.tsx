import { inter } from "@/app/ui/fonts";
import { ScheduleWorkout } from "@/app/lib/definitions";
import { StarIcon } from "@heroicons/react/24/solid";

// export default async function WorkoutWrapper() {
//   return (
//     <>
//       {/* NOTE: Uncomment this code in Chapter 9 */}

//       {/* <Card title="Collected" value={totalPaidWorkouts} type="collected" />
//       <Card title="Pending" value={totalPendingWorkouts} type="pending" />
//       <Card title="Total Workouts" value={numberOfWorkouts} type="workouts" />
//       <Card
//         title="Total Customers"
//         value={numberOfCustomers}
//         type="customers"
//       /> */}
//     </>
//   );
// }

export default async function Card({
  Schedules,
}: {
  Schedules: ScheduleWorkout[];
}) {
  const Weeks = [
    { day: 0, desc: "Sunday" },
    { day: 1, desc: "Monday" },
    { day: 2, desc: "Tuesday" },
    { day: 3, desc: "Wednesday" },
    { day: 4, desc: "Thurdsay" },
    { day: 5, desc: "Friday" },
    { day: 6, desc: "Saturday" },
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-7 lg:grid-cols-7">
      {Weeks.map((week) => {
        return (
          <div key={week.day} className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
              {/* {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null} */}
              <h3 className="ml-2 text-sm font-medium">{week.desc}</h3>
            </div>
            {Schedules.map((schedule) => {
              const scheduled = schedule.date_completed.getUTCDay() == week.day;
              const background =
                schedule.status == "COMPLETED" ? "green-200" : "white";
              const iconColor =
                schedule.status == "COMPLETED" ? "yellow-300" : "gray-500";
              return (
                <div key={schedule.id}>
                  {scheduled && (
                    <p
                      className={`${inter.className}
                                        flex flex-row gap-4 justify-start truncate rounded-md bg-${background} px-4 py-4 text-center text-sm`}
                    >
                      {schedule.status == "COMPLETED" && (
                        <StarIcon className={`h-5 w-5 text-${iconColor}`} />
                      )}
                      {schedule.name}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
