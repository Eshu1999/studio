'use client';

import { useFirebase } from '../provider';

// This is now a simple alias for useUser from the main provider.
// It maintains compatibility with components that imported it directly.
export const useUser = () => {
    const { user, isUserLoading, userError } = useFirebase();
    return { user, loading: isUserLoading, userError };
}
