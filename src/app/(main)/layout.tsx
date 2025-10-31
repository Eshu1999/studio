
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
  const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'incomplete' | 'verified'>('loading');

  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );

  useEffect(() => {
    // This effect handles the initial auth check and redirection logic.
    if (loading) {
      setAuthStatus('loading');
      return;
    }

    if (!user) {
      setAuthStatus('unauthenticated');
      router.push('/login');
      return;
    }

    if (userDocRef) {
      getDoc(userDocRef).then((userDoc) => {
        if (!userDoc.exists() || !userDoc.data()?.role) {
          // If profile is truly incomplete, redirect.
          setAuthStatus('incomplete');
          router.push('/complete-profile');
        } else {
          // If a document with a role exists, they are at least partially set up.
          // The dashboard will handle the more granular verification states.
          setAuthStatus('verified');
        }
      }).catch(() => {
        // Handle potential Firestore errors during fetch.
        setAuthStatus('unauthenticated');
        router.push('/login');
      });
    } else if (!user && !loading) {
      // Redundant check for safety, but helps clarify flow.
      setAuthStatus('unauthenticated');
      router.push('/login');
    }

  }, [user, loading, router, userDocRef]);


  if (authStatus !== 'verified') {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
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
