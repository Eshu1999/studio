
'use client';

import { useState } from 'react';
import { DoctorCard } from '@/components/doctor-card';
import { doctors, appointments } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function DoctorsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const connectedDoctorIds = [...new Set(appointments.map(a => a.doctorId))];
    
    // Filter for verified doctors first, then apply search
    const verifiedDoctors = doctors.filter(doc => doc.verificationStatus === 'verified');

    const searchedDoctors = verifiedDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const connectedDoctors = searchedDoctors.filter(d => connectedDoctorIds.includes(d.id));
    const otherDoctors = searchedDoctors.filter(d => !connectedDoctorIds.includes(d.id));

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Find a Doctor</h1>
                    <p className="text-muted-foreground">
                        Search for a specialist to connect with.
                    </p>
                </div>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input 
                        type="text" 
                        placeholder="Search by name or specialty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-10"
                    />
                    <Button type="submit" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
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

            {searchedDoctors.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                    <p>No doctors found matching your search.</p>
                </div>
            )}
        </div>
    );
}
