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
import { FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ConsultationsPage() {
  const completedAppointments = appointments.filter(
    (a) => a.status === 'Completed'
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Consultation History
        </h1>
        <p className="text-muted-foreground">
          Review your past video consultations and AI-generated summaries.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Consultations</CardTitle>
          <CardDescription>
            You have{' '}
            {completedAppointments.length} completed consultations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedAppointments.map((apt) => {
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
                              <AvatarImage
                                src={image.imageUrl}
                                alt={doctor.name}
                              />
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
                        <div>
                          {new Date(apt.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">{apt.time}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/consultation/${apt.id}`}>
                            View Summary
                            <FileText className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center text-muted-foreground py-12">
                <p>You have no completed consultations yet.</p>
                <Button variant="link" asChild className="mt-2">
                    <Link href="/doctors">Book an appointment to get started.</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
