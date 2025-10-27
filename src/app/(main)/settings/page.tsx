'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';

export default function SettingsPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [userData, setUserData] = useState<any>(null);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  
  const doctorProfileRef = useMemoFirebase(
    () => (firestore && user && userData?.role === 'doctor' ? doc(firestore, `users/${user.uid}/doctorProfile`, user.uid) : null),
    [firestore, user, userData]
  );

  useEffect(() => {
    const fetchData = async () => {
        if (userLoading) return;
        if (!userDocRef) {
            setLoading(false);
            return;
        }

        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(data);

                if (data.role === 'doctor') {
                    const profileRef = doc(firestore, `users/${user.uid}/doctorProfile`, user.uid);
                    const profileDoc = await getDoc(profileRef);
                    if (profileDoc.exists()) {
                        setDoctorProfile(profileDoc.data());
                    } else {
                        setDoctorProfile({}); // Init empty profile for new doctors
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast({ title: "Error", description: "Could not fetch user data.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [userDocRef, userLoading, user, firestore, toast]);

  const handleSaveChanges = async () => {
    if (!user || !firestore || !userData || !userDocRef) return;
    
    const userProfileData = {
      firstName: userData.firstName,
      lastName: userData.lastName
    };

    setDoc(userDocRef, userProfileData, { merge: true })
      .catch(error => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: userProfileData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

    if (userData.role === 'doctor' && doctorProfileRef && doctorProfile) {
        const doctorProfileData = {
            ...doctorProfile,
            id: user.uid,
        };
        setDoc(doctorProfileRef, doctorProfileData, { merge: true })
          .catch(error => {
             const permissionError = new FirestorePermissionError({
                path: doctorProfileRef.path,
                operation: 'write',
                requestResourceData: doctorProfileData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
    }

    toast({
      title: 'Settings Saved',
      description: 'Your changes have been saved.',
    });
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/login');
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const getDoctorProfileUrl = () => {
    if (typeof window !== 'undefined' && user) {
        return `${window.location.origin}/doctors/${user.uid}`;
    }
    return '';
  }

  if (loading || userLoading) {
    return <div className="flex h-full items-center justify-center">Loading Settings...</div>;
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Update your profile information and manage your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.photoURL ?? "https://picsum.photos/seed/user/100/100"} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Change Picture
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={userData?.firstName || ''} onChange={(e) => setUserData({...userData, firstName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={userData?.lastName || ''} onChange={(e) => setUserData({...userData, lastName: e.target.value})} />
            </div>
             <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email ?? ''} disabled />
            </div>
          </div>
          
          {userData?.role === 'doctor' && doctorProfile !== null && (
            <>
              <Separator />
              <div className="space-y-4">
                 <h3 className="text-lg font-medium">Doctor Profile</h3>
                 <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input id="specialization" value={doctorProfile?.specialization || ''} onChange={(e) => setDoctorProfile({...doctorProfile, specialization: e.target.value})} placeholder="e.g., Cardiology"/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input id="experience" type="number" value={doctorProfile?.experienceYears || ''} onChange={(e) => setDoctorProfile({...doctorProfile, experienceYears: Number(e.target.value)})} placeholder="e.g., 10"/>
                    </div>
                     <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="availability">Availability Notes</Label>
                      <Input id="availability" value={doctorProfile?.availability || ''} onChange={(e) => setDoctorProfile({...doctorProfile, availability: e.target.value})} placeholder="e.g., Mon-Fri, 9am-5pm"/>
                    </div>
                 </div>
              </div>
            </>
          )}

          {userData?.role === 'doctor' && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Profile QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Patients can scan this code to quickly access your profile and book an appointment.
                </p>
                <div className="p-4 bg-white rounded-md flex items-center justify-center max-w-xs mx-auto">
                  {user && <QRCode value={getDoctorProfileUrl()} size={200} />}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-2">
            <Label>Change Password</Label>
            <div className="grid sm:grid-cols-2 gap-4">
                <Input type="password" placeholder="Current Password" />
                <Input type="password" placeholder="New Password" />
            </div>
          </div>

          <Separator />

          <div>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>

        </CardContent>
      </Card>
      
      <div className="flex justify-end">
          <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  );
}
