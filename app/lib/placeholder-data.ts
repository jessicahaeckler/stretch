const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    username: 'Golgra',
    email: 'golgra@nextmail.com',
    password: '123456',
    streak: 100
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442b',
    username: 'Alex L. Armstrong',
    email: 'alex@nextmail.com',
    password: '123457',
    streak: 1
  },
];

const workouts = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6443b',
    date_entered: new Date().toISOString().split('T')[0],
    user_id: users[0].id,
    name: 'Stretch Routine',
    duration: '30:00',
    schedule_days: ['sunday', 'monday','tuesday','wednesday','thursday','friday','saturday'],
    status: 'public',
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6441b',
    user_id: users[0].id,
    name: 'Workout Routine',
    duration: '30:00',
    schedule_days: ['sunday', 'monday','tuesday','wednesday','thursday','friday','saturday'],
    status: 'public',
    date_entered: new Date().toISOString().split('T')[0]
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442b',
    user_id: users[0].id,
    name: 'Leg Day',
    duration: '30:00',
    schedule_days: ['sunday', 'monday','tuesday','wednesday','thursday','friday','saturday'],
    status: 'public',
    date_entered: new Date().toISOString().split('T')[0]
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6444b',
    user_id: users[0].id,
    name: 'Arm Day',
    duration: '30:00',
    schedule_days: ['sunday', 'monday','tuesday','wednesday','thursday','friday','saturday'],
    status: 'public',
    date_entered: new Date().toISOString().split('T')[0]
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6445b',
    user_id: users[0].id,
    name: 'Core Day',
    duration: '30:00',
    schedule_days: ['sunday', 'monday','tuesday','wednesday','thursday','friday','saturday'],
    status: 'public',
    date_entered: new Date().toISOString().split('T')[0]
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6446b',
    user_id: users[0].id,
    name: 'Back Day',
    duration: '30:00',
    schedule_days: ['sunday', 'monday','tuesday','wednesday','thursday','friday','saturday'],
    status: 'public',
    date_entered: new Date().toISOString().split('T')[0]
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6141b',
    user_id: users[0].id,
    name: 'Full Body',
    duration: '30:00',
    schedule_days: ['sunday', 'monday','tuesday','wednesday','thursday','friday','saturday'],
    status: 'public',
    date_entered: new Date().toISOString().split('T')[0]
  },
  {
    id: '410544b2-4001-4271-9855-fec4b6a6241b',
    user_id: users[0].id,
    name: 'Cardio Routine',
    duration: '30:00',
    schedule_days: ['sunday', 'monday','tuesday','wednesday','thursday','friday','saturday'],
    status: 'public',
    date_entered: new Date().toISOString().split('T')[0]
  },
];

const exercises = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Right leg swings side',
    description: 'swing right leg to the side ',
    image_url: '/snail.jpg',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Left leg swings side',
    description: 'swing left leg to the side',
    image_url: '/snail.jpg',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Right leg swings forward',
    description: 'swing right leg to the front ',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Left leg swings forward',
    description: 'swing left leg to the front ',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f3',
    name: 'Standing Splits Hamstring Floss Left',
    description: 'Flex quads for 2 - 5 seconds and relax',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f4',
    name: 'Standing Splits Hamstring Floss Right',
    description: 'Flex quads for 2 - 5 seconds and relax',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f5',
    name: 'Toes Elevated Forward Fold Left',
    description: 'Prop toes against something and bend forward to touch your toes',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f6',
    name: 'Toes Elevated Forward Fold Right',
    description: 'Prop toes against something and bend forward to touch your toes',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f7',
    name: 'Low Lunge Left',
    description: '',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f8',
    name: 'Low Lunge Right',
    description: '',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f9',
    name: 'Front Split Left',
    description: '',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2b0',
    name: 'Frog Stance',
    description: '',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2b1',
    name: 'Horse Stance',
    description: '',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2b2',
    name: 'Horse Stance',
    description: '',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2b3',
    name: 'Horse Stance',
    description: '',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2b4',
    name: 'Middle Split',
    description: '',
    image_url: '/snail.jpg',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2b5',
    name: 'Pancake Split',
    description: '',
    image_url: '/snail.jpg',
  },
];

const workout_exercise_links = [
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[0].id,
    time: null,
    reps: 10,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[1].id,
    time: null,
    reps: 10,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[2].id,
    time: null,
    reps: 10,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[3].id,
    time: null,
    reps: 10,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[4].id,
    time: '01:00',
    reps: 0,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[5].id,
    time: '01:00',
    reps: 0,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[6].id,
    time: '01:00',
    reps: 0,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[7].id,
    time: '01:00',
    reps: 0,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[8].id,
    time: '02:00',
    reps: 0,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[9].id,
    time: '02:00',
    reps: 0,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[10].id,
    time: '02:00',
    reps: 0,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[11].id,
    time: '03:00',
    reps: 0,
    rest: '00:00'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[12].id,
    time: '01:00',
    reps: 0,
    rest: '01:00'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[13].id,
    time: '01:00',
    reps: 0,
    rest: '01:00'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[14].id,
    time: '01:00',
    reps: 0,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[15].id,
    time: '02:00',
    reps: 0,
    rest: '00:20'
   },
   { 
    workout_id: workouts[0].id,
    exercise_id: exercises[16].id,
    time: '02:00',
    reps: 0,
    rest: '00:20'
   }

];

const schedules = [
  {
    id: '76d65c26-f784-44a2-ac19-186678f7c4e9',
    workout_id: workouts[0].id,
    status: 'SCHEDULED',
    date_completed: '2026-06-17'
  },
  {
    id: '76d65c26-f784-44a2-ac19-286678f7c4e9',
    workout_id: workouts[0].id,
    status: 'SCHEDULED',
    date_completed: '2026-06-18'
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c4e9',
    workout_id: workouts[0].id,
    status: 'COMPLETED',
    date_completed: '2026-06-19'
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c3d9',
    workout_id: workouts[0].id,
    status: 'COMPLETED',
    date_completed: '2026-06-20'
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2c9',
    workout_id: workouts[0].id,
    status: 'COMPLETED',
    date_completed: '2026-06-21'
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2d9',
    workout_id: workouts[0].id,
    status: 'SCHEDULED',
    date_completed: '2026-06-22'
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2e9',
    workout_id: workouts[0].id,
    status: 'SCHEDULED',
    date_completed: '2026-06-23'
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f9',
    workout_id: workouts[0].id,
    status: 'SCHEDULED',
    date_completed: '2026-06-24'
  },
  {
    id: '76d65c16-f784-44a2-ac19-586678f7c2f9',
    workout_id: workouts[0].id,
    status: 'SCHEDULED',
    date_completed: '2026-06-25'
  },
  {
    id: '76d65c21-f784-44a2-ac19-586678f7c2f9',
    workout_id: workouts[0].id,
    status: 'SCHEDULED',
    date_completed: '2026-06-26'
  },
  {
    id: '76d65c22-f784-44a2-ac19-586678f7c2f9',
    workout_id: workouts[0].id,
    status: 'SCHEDULED',
    date_completed: '2026-06-27'
  },
  {
    id: '76d65c23-f784-44a2-ac19-586678f7c2f9',
    workout_id: workouts[0].id,
    status: 'SCHEDULED',
    date_completed: '2026-06-28'
  },
  {
    id: '76d65c24-f784-44a2-ac19-586678f7c2f9',
    workout_id: workouts[0].id,
    status: 'SCHEDULED',
    date_completed: '2026-06-29'
  },
]

export { users, workouts, exercises, workout_exercise_links, schedules };