'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import PatientDashboard from '@/components/patient-dashboard';
import DoctorDashboard from '@/components/doctor-dashboard';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [role, setRole] = useState<string | null>(null);
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
            setRole(docSnap.data().role);
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

  if (loading || userLoading) {
    return <div className="flex h-full items-center justify-center">Loading Dashboard...</div>;
  }

  if (role === 'doctor') {
    return <DoctorDashboard />;
  }

  return <PatientDashboard />;
}
