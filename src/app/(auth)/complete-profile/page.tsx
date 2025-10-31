'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, Stethoscope } from 'lucide-react';
import { useEffect } from 'react';

export default function CompleteProfilePage() {
  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [role, setRole] = useState<'patient' | 'doctor' | ''>('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [step, setStep] = useState<'role' | 'details'>('role');

  useEffect(() => {
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery === 'patient') {
      setRole('patient');
      setStep('details');
    } else if (roleFromQuery === 'doctor') {
      setRole('doctor');
      setStep('details');
    }
  }, [searchParams]);

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast({ title: 'Error', description: 'Please select a role.', variant: 'destructive' });
      return;
    }
    if (role === 'patient') {
      setStep('details');
    } else if (role === 'doctor') {
      router.push('/verify-credentials');
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
      toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }
    if (!username || !firstName || !lastName) {
        toast({ title: 'Error', description: 'Please fill out all fields.', variant: 'destructive' });
        return;
    }

    const userRef = doc(firestore, 'users', user.uid);
    
    // For patients, we set the role. For doctors, the role is already set.
    const userData: any = {
      id: user.uid,
      email: user.email,
      username,
      firstName,
      lastName,
      ...(role === 'patient' && { role: 'patient' }),
    };

    setDoc(userRef, userData, { merge: true })
      .then(() => {
        toast({
          title: 'Profile Complete!',
          description: 'Your profile has been set up.',
        });
        router.push('/dashboard');
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'write',
            requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const renderRoleSelection = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Choose Your Role</CardTitle>
        <CardDescription>
          Select whether you are joining as a patient or a doctor.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRoleSubmit}>
        <CardContent className="grid gap-4">
          <RadioGroup
            value={role}
            onValueChange={(value) => setRole(value as 'patient' | 'doctor')}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
              <Label
                htmlFor="patient"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <UserIcon className="mb-3 h-6 w-6" />
                I'm a Patient
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="doctor"
                id="doctor"
                className="peer sr-only"
              />
              <Label
                htmlFor="doctor"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Stethoscope className="mb-3 h-6 w-6" />
                I'm a Doctor
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </CardFooter>
      </form>
    </Card>
  );

  const renderDetailsForm = () => (
     <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            {role === 'doctor'
              ? "Your credentials are verified! Just a few more details to activate your account."
              : "Just a few more details to get you started."
            }
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleDetailsSubmit}>
          <CardContent className="grid gap-6">
             <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="maxrobinson" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="Max" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Save and Continue to Dashboard
            </Button>
          </CardFooter>
        </form>
      </Card>
  );


  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      {step === 'role' && renderRoleSelection()}
      {step === 'details' && renderDetailsForm()}
    </div>
  );
}
