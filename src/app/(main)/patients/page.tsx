
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { patients, appointments } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUpRight, Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function PatientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    const userDocRef = useMemoFirebase(
        () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
        [firestore, user]
    );

    useEffect(() => {
        if (userDocRef) {
            getDoc(userDocRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userRole = docSnap.data().role;
                    setRole(userRole);
                    if (userRole !== 'doctor') {
                        router.push('/dashboard');
                    }
                } else {
                     router.push('/dashboard');
                }
            });
        } else if (!userLoading) {
            router.push('/dashboard');
        }
    }, [userDocRef, userLoading, router]);

    const connectedPatientIds = user ? [...new Set(appointments.filter(a => a.doctorId === user.uid).map(a => a.patientId))] : [];

    const filteredPatients = patients.filter(patient => 
        connectedPatientIds.includes(patient.id) &&
        (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (userLoading || role !== 'doctor') {
        return <div className="flex h-full items-center justify-center">Loading or Access Denied...</div>;
    }

  return (
    <div className="flex flex-col gap-6">
       <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">My Patients</h1>
            <p className="text-muted-foreground">
                View and manage your connected patients.
            </p>
        </div>
        <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
                type="text" 
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
            />
            <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
            </Button>
        </div>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Connected Patients</CardTitle>
          <CardDescription>
            You have {filteredPatients.length} connected patients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden md:table-cell">Last Appointment</TableHead>
                  <TableHead className="hidden sm:table-cell">Total Consultations</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={patient.avatar} alt={patient.name} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {patient.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(patient.lastAppointment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {appointments.filter(a => a.patientId === patient.id && a.doctorId === user?.uid).length}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/patients/${patient.id}`}>
                          View Profile
                          <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>You have no patients yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
