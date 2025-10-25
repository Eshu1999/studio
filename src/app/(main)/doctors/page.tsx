
import { DoctorCard } from '@/components/doctor-card';
import { doctors } from '@/lib/data';

export default function DoctorsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
                <div>
                <h1 className="text-3xl font-bold tracking-tight">Find a Doctor</h1>
                <p className="text-muted-foreground">
                    Browse our list of specialists and book an appointment.
                </p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {doctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
            </div>
        </div>
    );
}
