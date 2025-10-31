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
import { Upload, ShieldCheck, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useStorage } from '@/firebase';
import { doc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function VerifyCredentialsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  
  const [fullName, setFullName] = useState('');
  const [stateOfRegistration, setStateOfRegistration] = useState('');
  const [medicalCouncilId, setMedicalCouncilId] = useState('');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLicenseFile(file);
      setFileName(file.name);
    } else {
      setLicenseFile(null);
      setFileName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !stateOfRegistration || !medicalCouncilId || !licenseFile) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields and upload your medical license.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!user || !firestore || !storage) {
      toast({ title: "Error", description: "You must be logged in to submit credentials.", variant: "destructive"});
      return;
    }

    setIsSubmitting(true);
    
    // Provide immediate feedback to the user
    toast({
      title: 'Credentials Submitted',
      description: 'Your submission is now under review by our support team.',
    });
    router.push('/dashboard');

    // Perform upload and database write in the background
    const processSubmission = async () => {
        try {
            // 1. Upload file to Firebase Storage
            const filePath = `doctor-licenses/${user.uid}/${licenseFile.name}`;
            const storageRef = ref(storage, filePath);
            const uploadResult = await uploadBytes(storageRef, licenseFile!);
            const downloadURL = await getDownloadURL(uploadResult.ref);

            // 2. Prepare Firestore batch write
            const userRef = doc(firestore, 'users', user.uid);
            const doctorProfileRef = doc(firestore, `users/${user.uid}/doctorProfile/${user.uid}`);
            const batch = writeBatch(firestore);

            // Set initial user data with role and pending status
            batch.set(userRef, {
                id: user.uid,
                email: user.email,
                role: 'doctor',
                verificationStatus: 'pending'
            }, { merge: true });

            // Set doctor profile data for verification
            const doctorProfileData = { 
                id: user.uid,
                fullName,
                stateOfRegistration,
                medicalCouncilId,
                licenseDocument: downloadURL,
                manualVerificationRequired: false,
            };
            batch.set(doctorProfileRef, doctorProfileData);
            
            // 3. Commit the batch
            await batch.commit();

        } catch (error: any) {
            console.error("Background submission error:", error);
            // Optionally, you could use a background notification system or
            // log this to a more robust error tracking service.
        } finally {
            // This will run in the background, the user is already on the dashboard
            if (typeof window !== 'undefined') {
                setIsSubmitting(false);
            }
        }
    };
    
    processSubmission();
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Doctor Verification</CardTitle>
            </div>
            <CardDescription>
              To begin your verification, please provide the following information.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
             <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name (as on your license)</Label>
              <Input
                id="full-name"
                placeholder="Dr. Jane Doe"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="medical-council-id">Registration Number</Label>
                  <Input
                    id="medical-council-id"
                    placeholder="MCID / State ID"
                    required
                    value={medicalCouncilId}
                    onChange={(e) => setMedicalCouncilId(e.target.value)}
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="license-file">Certificate Proof</Label>
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
                  disabled={isSubmitting}
                />
              </div>
               <p className="text-xs text-muted-foreground">Please upload a clear copy of your medical license.</p>
            </div>
          </CardContent>
          <CardContent>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
