'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { doctors } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function BookAppointmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const doctor = doctors.find((d) => d.id === params.id);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  
  if (!doctor) {
    notFound();
  }
  
  const availableTimes = date ? doctor.availability[date.toISOString().split('T')[0]] || [] : [];
  
  const handleBooking = () => {
    if (!date || !selectedTime) {
      toast({
        title: 'Incomplete Selection',
        description: 'Please select a date and time for your appointment.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, you would save this to a database
    console.log('Booking confirmed for', {
      doctorId: doctor.id,
      date,
      time: selectedTime,
    });
    
    toast({
      title: 'Appointment Booked!',
      description: `Your appointment with ${doctor.name} on ${date.toLocaleDateString()} at ${selectedTime} is confirmed.`,
    });

    router.push('/dashboard');
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Link href={`/doctors/${doctor.id}`} className="flex items-center text-sm text-muted-foreground hover:underline mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Profile
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Book Appointment</CardTitle>
          <CardDescription>With {doctor.name} - {doctor.specialization}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">1. Select a Date</h3>
            <div className="rounded-md border w-full flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1)) }
                className="p-0"
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Select a Time</h3>
            {date ? (
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.length > 0 ? (
                  availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className={cn(selectedTime === time && 'bg-primary text-primary-foreground')}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground col-span-3">No available slots for this day. Please select another date.</p>
                )}
              </div>
            ) : (
               <p className="text-sm text-muted-foreground">Please select a date to see available times.</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" onClick={handleBooking} disabled={!date || !selectedTime}>
            Confirm & Book
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
