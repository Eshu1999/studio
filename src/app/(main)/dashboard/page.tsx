'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PatientDashboard from '@/components/patient-dashboard';
import DoctorDashboard from '@/components/doctor-dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Video } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
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
          setUserData(data);

          if (data.role === 'doctor') {
            const doctorProfileRef = doc(firestore, `users/${user!.uid}/doctorProfile/${user!.uid}`);
            const doctorProfileSnap = await getDoc(doctorProfileRef);
            if (doctorProfileSnap.exists()) {
              setDoctorProfile(doctorProfileSnap.data());
            }
          }
        }
        setLoading(false);
      };

      fetchData().catch(() => setLoading(false));
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [userDocRef, userLoading, firestore, user]);

  useEffect(() => {
    if (loading || userLoading || !userData) return;

    if (userData.role === 'doctor') {
      const hasSubmittedCredentials = !!doctorProfile?.medicalCouncilId;
       // Scenario: Admin has approved credentials, but doctor hasn't set their username yet.
      if (userData.verificationStatus === 'pending' && doctorProfile?.manualVerificationRequired && !userData.username) {
        router.push('/complete-profile?role=doctor');
      }
    }
  }, [loading, userLoading, userData, doctorProfile, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (loading || userLoading) {
    return <div className="flex h-full items-center justify-center">Loading Dashboard...</div>;
  }

  // Doctor Flow
  if (userData?.role === 'doctor') {
    const hasSubmittedCredentials = !!doctorProfile?.medicalCouncilId;
    
    // 1. Doctor has NOT submitted credentials yet. This case is handled by main layout redirecting to complete-profile or verify-credentials.
    // For safety, we can have a check here.
    if (!hasSubmittedCredentials && userData.verificationStatus !== 'verified') {
        router.push('/verify-credentials');
        return <div className="flex h-full items-center justify-center">Redirecting to credential submission...</div>;
    }
    
    // 2. Doctor HAS submitted, pending ADMIN approval.
    if (userData.verificationStatus === 'pending' && !doctorProfile?.manualVerificationRequired && hasSubmittedCredentials) {
      return (
        <div className="flex h-full items-center justify-center">
          <Card className="max-w-lg text-center">
              <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Verification Pending</CardTitle>
                  <CardDescription>Welcome, Dr. {doctorProfile.fullName}. Your submission is under review.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                  <p className="text-sm text-muted-foreground">
                    Thank you for submitting your credentials. Our team will review them. Once verified, you will be prompted to complete your profile and set up a final verification call.
                  </p>
                  <div className="mt-6 flex items-center justify-center rounded-md border border-dashed p-4 text-green-600">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span className="font-medium">Credentials Submitted for Review</span>
                  </div>
                   <Button onClick={handleLogout} className="mt-4" variant="link">Log Out</Button>
              </CardContent>
          </Card>
        </div>
      );
    }
    
    // 3. Admin has approved credentials, but doctor hasn't completed profile yet (e.g. set username).
    // This is now handled by the useEffect above which redirects to /complete-profile.
    if (userData.verificationStatus === 'pending' && doctorProfile?.manualVerificationRequired && !userData.username) {
        return <div className="flex h-full items-center justify-center">Redirecting to complete your profile...</div>;
    }

    // 4. Admin has approved, doctor has completed profile, and video call is pending.
    if (userData.verificationStatus === 'pending' && doctorProfile?.manualVerificationRequired && userData.username) {
       return (
         <div className="flex h-full items-center justify-center">
          <Card className="max-w-2xl text-center">
              <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                      <Video className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Final Step: Video Verification</CardTitle>
                  <CardDescription>Dr. {userData.firstName}, your credentials have been approved!</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                  <p className="text-sm text-muted-foreground max-w-prose">
                    To activate your account and make your profile public, please schedule a brief one-on-one video call with our verification team. Please have your physical documents ready to show on the call.
                  </p>
                  <div className="mt-4 text-left p-4 bg-secondary rounded-md w-full">
                      <h4 className="font-semibold text-sm">Please have the following documents ready:</h4>
                      <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                          <li>Aadhaar Card (or other national ID)</li>
                          <li>Medical Certificate</li>
                          <li>Medical License</li>
                      </ul>
                  </div>
                  <Button asChild className="mt-6">
                    <Link href="/schedule-verification-call">Schedule Verification Call</Link>
                  </Button>
                   <Button onClick={handleLogout} className="mt-4" variant="link">Log Out</Button>
              </CardContent>
          </Card>
        </div>
       )
    }

    // 5. Doctor is fully verified.
    if (userData.verificationStatus === 'verified') {
      return <DoctorDashboard />;
    }
  }


  // Fallback for patients or any other role
  return <PatientDashboard />;
}
