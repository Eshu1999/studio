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
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { toast } = useToast();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSaveChanges = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your changes have been saved successfully.',
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

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>

      {/* Account Settings */}
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
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.displayName ?? 'Current User'} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email ?? 'user@example.com'} />
            </div>
          </div>
          
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

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
          <CardDescription>
            Customize the application to your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Choose between light and dark mode.</p>
            </div>
            <Select defaultValue="system">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground">Select your preferred language.</p>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
               <p className="text-sm text-muted-foreground">Receive updates about your appointments.</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>

        </CardContent>
      </Card>
      
      <div className="flex justify-end">
          <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  );
}
