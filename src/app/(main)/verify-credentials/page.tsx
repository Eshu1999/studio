'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useToast } from '@/hooks/use-toast';
import { Upload, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function VerifyCredentialsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [fullName, setFullName] = useState('');
  const [stateOfRegistration, setStateOfRegistration] = useState('');
  const [medicalCouncilId, setMedicalCouncilId] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !stateOfRegistration || !medicalCouncilId || !fileName) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields and upload your medical license.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!user || !firestore) {
      toast({ title: "Error", description: "You must be logged in to submit credentials.", variant: "destructive"});
      return;
    }

    // In a real application, you would upload the file to Firebase Storage
    const doctorProfileRef = doc(firestore, `users/${user.uid}/doctorProfile/${user.uid}`);
    const doctorProfileData = { 
        fullName,
        stateOfRegistration,
        medicalCouncilId,
        licenseDocument: fileName, // In a real app, this would be the storage URL
        manualVerificationRequired: false,
    };

    const userRef = doc(firestore, 'users', user.uid);
    const userData = {
        verificationStatus: 'pending'
    };

    try {
        setDoc(doctorProfileRef, doctorProfileData, { merge: true });
        setDoc(userRef, userData, { merge: true });
        
        toast({
          title: 'Credentials Submitted',
          description: 'Your profile will be reviewed by our support team to verify your account.',
        });

        router.push('/dashboard');

    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: `users/${user.uid}/doctorProfile/${user.uid}`,
            operation: 'write',
            requestResourceData: doctorProfileData,
        });
        errorEmitter.emit('permission-error', permissionError);
    }
  };

  return (
    <div className="flex flex-col min-h-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Submit Your Credentials</CardTitle>
            </div>
            <CardDescription>
              To complete your verification as a doctor, please provide the following information.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
             <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                placeholder="Enter your full name as on your license"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="medical-council-id">Medical Council ID</Label>
                  <Input
                    id="medical-council-id"
                    placeholder="e.g., 12345"
                    required
                    value={medicalCouncilId}
                    onChange={(e) => setMedicalCouncilId(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state-of-registration">State of Registration</Label>
                  <Input
                    id="state-of-registration"
                    placeholder="e.g., California"
                    required
                    value={stateOfRegistration}
                    onChange={(e) => setStateOfRegistration(e.target.value)}
                  />
                </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="license-file">Medical License Document</Label>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="license-file-upload"
                  className="flex-1 cursor-pointer h-10 px-3 py-2 text-sm text-muted-foreground rounded-md border border-input bg-background flex items-center justify-between"
                >
                  <span>{fileName || 'Upload a PDF or image'}</span>
                  <Upload className="h-4 w-4" />
                </Label>
                <Input
                  id="license-file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
               <p className="text-xs text-muted-foreground">Please upload a clear copy of your medical license. (PDF, JPG, PNG)</p>
            </div>
          </CardContent>
          <CardContent className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Submit for Verification
            </Button>
             <Button variant="link" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
