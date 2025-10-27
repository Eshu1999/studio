
'use client';

import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { patients, appointments, doctors } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft, FileText, Mail, Phone, Calendar } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';


export default function PatientProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [role, setRole] = useState<string | null>(null);
  const patient = patients.find((p) => p.id === params.id);
  
  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );

  useEffect(() => {
    if (userDocRef && patient) {
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userRole = docSnap.data().role;
            const currentUserId = docSnap.id;
            setRole(userRole);
            
            // Check if user is a doctor
            if (userRole !== 'doctor') {
              router.push('/dashboard');
              return;
            }
            
            // Check if this doctor is connected to the patient
            const isConnected = appointments.some(apt => 
                apt.patientId === patient.id && apt.doctorId === currentUserId
            );

            if (!isConnected) {
                // If not connected, redirect them.
                toast({
                    title: 'Access Denied',
                    description: "You can only view profiles of patients you are connected with.",
                    variant: 'destructive'
                })
                router.push('/patients');
            }

          } else {
            router.push('/dashboard');
          }
        });
    } else if (!userLoading) {
      router.push('/dashboard');
    }
  }, [userDocRef, userLoading, router, patient, toast]);


  if (!patient) {
    notFound();
  }

  const patientAppointments = appointments.filter(
    (apt) => apt.patientId === patient.id
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (userLoading || role !== 'doctor') {
    return <div className="flex h-full items-center justify-center">Loading or Access Denied...</div>;
  }

  return (
    <div className="container mx-auto max-w-5xl py-8">
       <Link href="/patients" className="flex items-center text-sm text-muted-foreground hover:underline mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to All Patients
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={patient.avatar} alt={patient.name} />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{patient.name}</CardTitle>
              <CardDescription>{patient.email}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
                 <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{patient.email}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>(555) 123-4567</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined: {new Date(patient.lastAppointment).getFullYear()}</span>
                 </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>
                A log of all consultations and summaries for {patient.name}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {patientAppointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientAppointments.map((apt) => {
                      const doctor = doctors.find(d => d.id === apt.doctorId);
                      return (
                         <TableRow key={apt.id}>
                            <TableCell>
                                <div className="font-medium">{doctor?.name}</div>
                                <div className="text-sm text-muted-foreground">{doctor?.specialization}</div>
                            </TableCell>
                            <TableCell>
                                <div>{new Date(apt.date).toLocaleDateString()}</div>
                                <div className="text-sm text-muted-foreground">{apt.time}</div>
                            </TableCell>
                            <TableCell>
                                 <Badge 
                                    variant={apt.status === 'Completed' ? 'default' : apt.status === 'Cancelled' ? 'destructive' : 'secondary'}
                                    className={cn(apt.status === 'Upcoming' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300')}
                                >
                                    {apt.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {apt.status === "Completed" && (
                                     <Button variant="outline" size="sm" asChild>
                                        <Link href={`/consultation/${apt.id}`}>
                                            View Summary
                                            <FileText className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>
                                )}
                            </TableCell>
                         </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No appointment history found for this patient.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
