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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

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
    () => (firestore && user ? doc(firestore, `users/${user.uid}/doctorProfile`, user.uid) : null),
    [firestore, user]
  );


  useEffect(() => {
    const fetchData = async () => {
      if (userDocRef) {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          if (data.role === 'doctor' && doctorProfileRef) {
            const profileDoc = await getDoc(doctorProfileRef);
            if (profileDoc.exists()) {
              setDoctorProfile(profileDoc.data());
            } else {
              setDoctorProfile({}); // Init empty profile for new doctors
            }
          }
        }
      }
      setLoading(false);
    };
    if (!userLoading) {
      fetchData();
    }
  }, [userDocRef, doctorProfileRef, userLoading]);

  const handleSaveChanges = async () => {
    if (!user || !firestore || !userData) return;
    try {
      if (userDocRef) {
        await setDoc(userDocRef, {
          firstName: userData.firstName,
          lastName: userData.lastName
        }, { merge: true });
      }

      if (userData.role === 'doctor' && doctorProfileRef && doctorProfile) {
        await setDoc(doctorProfileRef, {
            ...doctorProfile,
            id: user.uid,
        }, { merge: true });
      }

      toast({
        title: 'Settings Saved',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to save changes: ${error.message}`,
        variant: 'destructive',
      });
    }
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
          
          {userData?.role === 'doctor' && doctorProfile && (
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
