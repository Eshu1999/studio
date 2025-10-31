
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
  const [authStatus, setAuthStatus] = useState<'loading' | 'unauthenticated' | 'incomplete' | 'pending' | 'verified'>('loading');

  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );

  useEffect(() => {
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
        if (userDoc.exists() && userDoc.data()?.role) {
            const userData = userDoc.data();
            if (userData.role === 'doctor' && userData.verificationStatus !== 'verified') {
                setAuthStatus('pending');
                // If a pending doctor tries to access a restricted page, redirect them.
                if (!['/dashboard', '/settings', '/help'].includes(window.location.pathname)) {
                    router.push('/dashboard');
                } else {
                    setAuthStatus('verified'); // Allow rendering for permitted pages
                }
            } else {
                setAuthStatus('verified');
            }
        } else {
          setAuthStatus('incomplete');
          router.push('/complete-profile');
        }
      }).catch(() => {
        setAuthStatus('unauthenticated');
        router.push('/login');
      });
    } else if (!user && !loading) {
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
