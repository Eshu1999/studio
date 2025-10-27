
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

export default function VerifyCredentialsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [npiNumber, setNpiNumber] = useState('');
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
    if (!npiNumber || !fileName) {
      toast({
        title: 'Missing Information',
        description: 'Please provide your NPI number and upload your medical license.',
        variant: 'destructive',
      });
      return;
    }

    // In a real application, you would upload the file to Firebase Storage
    // and save the NPI number and file path to the user's profile in Firestore.
    console.log('Submitting for verification:', { npiNumber, fileName });

    toast({
      title: 'Credentials Submitted',
      description: 'Thank you. Your documents have been submitted for review. You will be notified via email upon verification.',
    });

    // Redirect the user back to the dashboard where they will see the pending message.
    router.push('/dashboard');
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
              <Label htmlFor="npi-number">National Provider Identifier (NPI)</Label>
              <Input
                id="npi-number"
                placeholder="Enter your 10-digit NPI number"
                required
                value={npiNumber}
                onChange={(e) => setNpiNumber(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="license-file">Medical License</Label>
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
