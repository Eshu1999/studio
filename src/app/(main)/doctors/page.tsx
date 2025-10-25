
import { DoctorCard } from '@/components/doctor-card';
import { doctors, appointments } from '@/lib/data';

export default function DoctorsPage() {
    const connectedDoctorIds = [...new Set(appointments.map(a => a.doctorId))];
    
    const connectedDoctors = doctors.filter(d => connectedDoctorIds.includes(d.id));
    const otherDoctors = doctors.filter(d => !connectedDoctorIds.includes(d.id));

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-start">
                <div>
                <h1 className="text-3xl font-bold tracking-tight">Find a Doctor</h1>
                <p className="text-muted-foreground">
                    Browse our list of specialists and book an appointment.
                </p>
                </div>
            </div>

            {connectedDoctors.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">Your Connected Doctors</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {connectedDoctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                </section>
            )}

            {otherDoctors.length > 0 && (
                 <section>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">{connectedDoctors.length > 0 ? 'Other Doctors' : 'All Doctors'}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {otherDoctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
