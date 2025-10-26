'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  HeartPulse,
  LayoutDashboard,
  Calendar,
  Users,
  Video,
  Settings,
  CircleHelp,
  Briefcase,
  CalendarClock,
} from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';


const patientNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/appointments', icon: Calendar, label: 'Appointments' },
  { href: '/doctors', icon: Users, label: 'Doctors' },
  { href: '/consultations', icon: Video, label: 'Consultations' },
];

const doctorNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/appointments', icon: Calendar, label: 'Appointments' },
  { href: '/patients', icon: Users, label: 'My Patients' },
  { href: '/availability', icon: CalendarClock, label: 'Availability' },
]

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const [role, setRole] = useState<string | null>(null);

  const userDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  
  useEffect(() => {
    if (userDocRef) {
      getDoc(userDocRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setRole(docSnap.data().role);
          }
        });
    }
  }, [userDocRef]);

  const navItems = role === 'doctor' ? doctorNavItems : patientNavItems;

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 py-2">
          <HeartPulse className="h-7 w-7 text-primary" />
          <span className="text-xl font-semibold">DocConnect</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="/settings">
                    <SidebarMenuButton isActive={pathname.startsWith('/settings')} tooltip={{children: 'Settings'}}>
                        <Settings />
                        <span>Settings</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <Link href="/help">
                    <SidebarMenuButton isActive={pathname.startsWith('/help')} tooltip={{children: 'Help & Support'}}>
                        <CircleHelp />
                        <span>Help & Support</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
