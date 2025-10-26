'use client';

import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useUser, FirebaseClientProvider, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);

  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );

  useEffect(() => {
    if (loading) return; // Wait until user auth state is resolved

    if (!user) {
      router.push('/login');
      return;
    }

    // Now that we know we have a user, check their profile document.
    if (userDocRef) {
      getDoc(userDocRef).then((userDoc) => {
        if (userDoc.exists() && userDoc.data()?.role) {
          setIsProfileComplete(true);
        } else {
          setIsProfileComplete(false);
          router.push('/complete-profile');
        }
      }).catch(() => {
        // Handle potential errors fetching the doc
        setIsProfileComplete(false);
        router.push('/login');
      });
    } else {
        // This case handles when firestore isn't ready yet, though it should be.
        // Or if user exists but firestore doesn't for some reason.
        if (!loading && user) {
            // A user is logged in, but we can't check their profile.
            // Let's assume for a moment the profile is incomplete and redirect.
            // This is a failsafe.
            setIsProfileComplete(false);
            router.push('/complete-profile');
        }
    }
  }, [user, loading, router, firestore, userDocRef]);


  if (loading || isProfileComplete === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isProfileComplete) {
    // Redirect is happening, so we can render null or a loader
     return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col min-h-screen w-full">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </FirebaseClientProvider>
  );
}
