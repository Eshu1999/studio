
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HeartPulse, Chrome } from 'lucide-react';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SignupPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth) return;

    setLoading(true);
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User is signed in.
          // New users (or existing users) are redirected to complete their profile.
          router.push('/complete-profile');
        }
      })
      .catch((error) => {
        // Handle Errors here.
        console.error("Google sign-up redirect error", error);
        toast({
          title: 'Sign-up Error',
          description: error.message,
          variant: 'destructive',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [auth, router, toast]);

  const handleGoogleSignUp = async () => {
    if (!auth) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      // Use signInWithRedirect instead of signInWithPopup
      await signInWithRedirect(auth, provider);
      // The user will be redirected to Google's sign-in page.
      // After successful sign-in, they will be redirected back to the app.
      // The onAuthStateChanged listener will then handle routing to /complete-profile.
    } catch (error: any) {
      setLoading(false);
      toast({
        title: 'Sign-up Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/complete-profile');
    } catch (error: any) {
      toast({
        title: 'Sign-up Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2">
        <HeartPulse className="h-8 w-8 text-primary" />
        <span className="text-2xl font-semibold">DocConnect</span>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleEmailSignUp} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </form>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignUp} disabled={loading}>
            <Chrome className="mr-2 h-4 w-4" />
            {loading ? 'Redirecting...' : 'Sign up with Google'}
          </Button>
        </CardContent>
        <div className="mt-4 p-6 pt-0 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
