
'use client';

import { useState, useEffect } from 'react';
import { DoctorCard } from '@/components/doctor-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Doctor } from '@/lib/types';

export default function DoctorsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState('');
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [connectedDoctorIds, setConnectedDoctorIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const appointmentsRef = useMemoFirebase(
        () => (firestore && user ? collection(firestore, 'appointments') : null),
        [firestore, user]
    );

    const { data: userAppointments } = useCollection(
        appointmentsRef && user ? query(appointmentsRef, where('patientId', '==', user.uid)) : null
    );

    useEffect(() => {
        if (userAppointments) {
            const ids = [...new Set(userAppointments.map(a => a.doctorId))];
            setConnectedDoctorIds(ids);
        }
    }, [userAppointments]);

    useEffect(() => {
        const fetchVerifiedDoctors = async () => {
            if (!firestore) return;
            setLoading(true);
            try {
                const usersRef = collection(firestore, 'users');
                const q = query(usersRef, where('role', '==', 'doctor'), where('verificationStatus', '==', 'verified'));
                const querySnapshot = await getDocs(q);
                
                const fetchedDoctors: Doctor[] = [];

                for (const userDoc of querySnapshot.docs) {
                    const userData = userDoc.data();
                    const profileRef = doc(firestore, `users/${userDoc.id}/doctorProfile`, userDoc.id);
                    const profileSnap = await getDoc(profileRef);

                    if (profileSnap.exists()) {
                        const profileData = profileSnap.data();
                        fetchedDoctors.push({
                            id: userDoc.id,
                            name: `${userData.firstName} ${userData.lastName}`,
                            specialization: profileData.specialization || 'N/A',
                            experience: profileData.experienceYears || 0,
                            bio: 'A dedicated medical professional.',
                            availability: profileData.availability || {},
                            imageId: 'doctor-1', // Placeholder
                            verificationStatus: 'verified',
                        });
                    }
                }
                setDoctors(fetchedDoctors);
            } catch (error) {
                console.error("Error fetching verified doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVerifiedDoctors();
    }, [firestore]);
    
    const searchedDoctors = doctors.filter(doctor => 
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

            {loading ? (
                 <div className="text-center text-muted-foreground py-12">Loading doctors...</div>
            ) : (
                <>
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

                    {searchedDoctors.length === 0 && !loading && (
                        <div className="text-center text-muted-foreground py-12">
                            <p>No doctors found matching your search.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
