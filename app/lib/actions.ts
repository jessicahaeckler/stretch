'use server';
 
export async function createWorkout(formData: FormData) {
    const rawFormData = {
        workout: formData.get('workout'),
        exerciseId: formData.get('exerciseId'),
        sunday: formData.get('sunday'),
        monday: formData.get('monday'),
        tuesday: formData.get('tuesday'),
        wednesday: formData.get('wednesday'),
        thurday: formData.get('thurday'),
        friday: formData.get('friday'),
        saturday: formData.get('saturday'),
        status: formData.get('status'),
    };
    // Test it out:
    for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
        }
}