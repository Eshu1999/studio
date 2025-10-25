
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { appointments, doctors } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowUpRight, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';

function AppointmentsTable({ appointmentsToShow }: { appointmentsToShow: Appointment[] }) {
  if (appointmentsToShow.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p>No appointments found in this category.</p>
      </div>
    )
  }

  return (
     <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Doctor</TableHead>
          <TableHead className="hidden md:table-cell">Date & Time</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointmentsToShow.map((apt) => {
          const doctor = doctors.find((d) => d.id === apt.doctorId);
          if (!doctor) return null;
          const image = PlaceHolderImages.find(
            (img) => img.id === doctor.imageId
          );
          return (
            <TableRow key={apt.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    {image && (
                      <AvatarImage src={image.imageUrl} alt={doctor.name} />
                    )}
                    <AvatarFallback>
                      {doctor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{doctor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {doctor.specialization}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div>{new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className="text-sm text-muted-foreground">{apt.time}</div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge 
                    variant={apt.status === 'Completed' ? 'default' : apt.status === 'Cancelled' ? 'destructive' : 'secondary'}
                    className={cn(apt.status === 'Upcoming' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300')}
                >
                    {apt.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {apt.status === 'Upcoming' && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/consultation/${apt.id}`}>
                      Join Call
                      <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
                 {apt.status === 'Completed' && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/consultation/${apt.id}`}>
                      View Summary
                      <Video className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}


export default function AppointmentsPage() {
  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');
  const completedAppointments = appointments.filter(a => a.status === 'Completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'Cancelled');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your past and upcoming appointments.
          </p>
        </div>
        <Button asChild>
          <Link href="/doctors">Book New Appointment</Link>
        </Button>
      </div>

       <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="p-4 border-b">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="all" className="m-0">
                <AppointmentsTable appointmentsToShow={appointments} />
            </TabsContent>
            <TabsContent value="upcoming" className="m-0">
                <AppointmentsTable appointmentsToShow={upcomingAppointments} />
            </TabsContent>
            <TabsContent value="completed" className="m-0">
                <AppointmentsTable appointmentsToShow={completedAppointments} />
            </TabsContent>
            <TabsContent value="cancelled" className="m-0">
                <AppointmentsTable appointmentsToShow={cancelledAppointments} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
