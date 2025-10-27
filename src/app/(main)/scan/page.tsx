'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner, Html5QrcodeError } from 'html5-qrcode';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        if (hasCamera) {
            // Attempt to get stream to trigger permission prompt
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop()); // Stop using camera immediately
            setHasCameraPermission(true);
        } else {
             setHasCameraPermission(false);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
  }, []);

  useEffect(() => {
    if (hasCameraPermission === true) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false // verbose
      );
      scannerRef.current = scanner;

      const onScanSuccess = (decodedText: string, decodedResult: any) => {
        scanner.clear();
        console.log(`Scan result: ${decodedText}`, decodedResult);
        try {
          const url = new URL(decodedText);
          if (url.pathname.startsWith('/doctors/')) {
             toast({
                title: 'Scan Successful!',
                description: `Redirecting to doctor's profile...`,
             });
             router.push(url.pathname);
          } else {
             toast({
                title: 'Invalid QR Code',
                description: 'This QR code does not point to a valid doctor profile.',
                variant: 'destructive',
             });
          }
        } catch (error) {
             toast({
                title: 'Invalid QR Code',
                description: 'The scanned code is not a valid URL.',
                variant: 'destructive',
             });
        }
      };

      const onScanFailure = (error: Html5QrcodeError) => {
        // console.warn(`Code scan error = ${error}`);
      };

      scanner.render(onScanSuccess, onScanFailure);

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(error => {
            console.error("Failed to clear html5-qrcode-scanner.", error);
          });
        }
      };
    }
  }, [hasCameraPermission, router, toast]);

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scan Doctor's QR Code</h1>
        <p className="text-muted-foreground">
          Point your camera at a QR code to instantly view a doctor's profile.
        </p>
      </div>

      <Card>
        <CardHeader>
           <div className="flex items-center gap-2">
             <QrCode className="h-6 w-6 text-primary"/>
             <CardTitle>QR Code Scanner</CardTitle>
           </div>
           <CardDescription>
                Place the doctor's QR code within the frame.
           </CardDescription>
        </CardHeader>
        <CardContent>
            {hasCameraPermission === null && <p>Checking for camera permissions...</p>}
            {hasCameraPermission === false && (
                 <Alert variant="destructive">
                    <Video className="h-4 w-4" />
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>
                        Please enable camera permissions in your browser settings to use the QR scanner.
                    </AlertDescription>
                </Alert>
            )}
            <div id="qr-reader" className="w-full"></div>
        </CardContent>
      </Card>
    </div>
  );
}
