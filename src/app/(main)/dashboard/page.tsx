
'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PatientDashboard from '@/components/patient-dashboard';
import DoctorDashboard from '@/components/doctor-dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileCheck } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<{ role: string, verificationStatus?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );

  useEffect(() => {
    if (userDocRef) {
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              role: data.role,
              verificationStatus: data.verificationStatus,
            });
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [userDocRef, userLoading]);

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
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Verification Pending</CardTitle>
                <CardDescription>
                    Your account is currently under review. Please submit your credentials to expedite the process.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground">
                    To complete your registration as a medical professional, please upload a copy of your medical license and provide your NPI number.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/verify-credentials">
                        <FileCheck className="mr-2 h-4 w-4"/>
                        Submit Credentials
                    </Link>
                </Button>
                 <Button onClick={handleLogout} className="mt-4" variant="link">Log Out</Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (userData?.role === 'doctor') {
    return <DoctorDashboard />;
  }

  return <PatientDashboard />;
}
