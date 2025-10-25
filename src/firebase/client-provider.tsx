'use client';

import React, { useState, useEffect } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [instances, setInstances] = useState(() => initializeFirebase());

  // We only want to initialize Firebase once on the client
  useEffect(() => {
    if (!instances) {
      setInstances(initializeFirebase());
    }
  }, [instances]);
  
  // If we're on the server or Firebase is not initialized, we don't render
  if (typeof window === 'undefined' || !instances) {
    return null;
  }

  return (
    <FirebaseProvider
      app={instances.app}
      auth={instances.auth}
      firestore={instances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
