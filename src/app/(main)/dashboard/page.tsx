'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PatientDashboard from '@/components/patient-dashboard';
import DoctorDashboard from '@/components/doctor-dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<{ role: string, verificationStatus?: string, firstName: string } | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );

  useEffect(() => {
    if (userDocRef) {
      const fetchData = async () => {
        setLoading(true);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          let profileData = null;

          if (data.role === 'doctor') {
            const doctorProfileRef = doc(firestore, `users/${user!.uid}/doctorProfile/${user!.uid}`);
            const doctorProfileSnap = await getDoc(doctorProfileRef);
            if (doctorProfileSnap.exists()) {
              profileData = doctorProfileSnap.data();
            }
          }
          setDoctorProfile(profileData);
          setUserData({
            role: data.role,
            verificationStatus: data.verificationStatus,
            firstName: data.firstName,
          });
        }
        setLoading(false);
      };

      fetchData().catch(() => setLoading(false));
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [userDocRef, userLoading, firestore, user]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (loading || userLoading) {
    return <div className="flex h-full items-center justify-center">Loading Dashboard...</div>;
  }

  if (userData?.role === 'doctor' && userData?.verificationStatus === 'pending') {
    const hasSubmittedCredentials = !!doctorProfile?.medicalCouncilId;

    return (
      <div className="flex h-full items-center justify-center">
        <Card className="max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Verification Pending</CardTitle>
                <CardDescription>
                    {hasSubmittedCredentials 
                        ? `Welcome, Dr. ${userData.firstName}. Your submission is under review.`
                        : `Welcome, Dr. ${userData.firstName}. Please submit your credentials to begin.`
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground">
                    {hasSubmittedCredentials
                        ? "Thank you for submitting your credentials. Our team will review them, and you'll be notified of the next step: a one-on-one video call."
                        : "To complete your registration as a medical professional, please provide your full name, state of registration, medical ID, and a copy of your license."
                    }
                </p>
                {hasSubmittedCredentials ? (
                    <div className="mt-6 flex items-center justify-center rounded-md border border-dashed p-4 text-green-600">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        <span className="font-medium">Credentials Submitted for Review</span>
                    </div>
                ) : (
                    <Button asChild className="mt-6">
                        <Link href="/verify-credentials">
                            <FileCheck className="mr-2 h-4 w-4"/>
                            Submit Credentials
                        </Link>
                    </Button>
                )}
                 <Button onClick={handleLogout} className="mt-4" variant="link">Log Out</Button>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (userData?.role === 'doctor' && userData?.verificationStatus === 'rejected') {
    return (
         <div className="flex h-full items-center justify-center">
             <Card className="max-w-lg text-center">
                <CardHeader>
                    {/* ... UI for rejected status ... */}
                </CardHeader>
             </Card>
         </div>
    );
  }


  if (userData?.role === 'doctor' && userData?.verificationStatus === 'verified') {
    return <DoctorDashboard />;
  }

  // Fallback for patients or any other role
  return <PatientDashboard />;
}
