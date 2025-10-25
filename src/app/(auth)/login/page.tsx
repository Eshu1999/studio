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
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Sign-in Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Admin Login Failed',
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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleEmailSignIn} className="grid gap-4">
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </CardContent>
        <div className="mt-4 p-6 pt-0 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
