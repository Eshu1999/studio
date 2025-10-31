'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ScheduleVerificationCallPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  
  // Generate time slots between 3 PM (15:00) and 6 PM (18:00)
  const availableTimes: string[] = [];
  for (let hour = 15; hour < 18; hour++) {
      availableTimes.push(`${hour}:00`);
      availableTimes.push(`${hour}:30`);
  }

  const handleBooking = () => {
    if (!date || !selectedTime) {
      toast({
        title: 'Incomplete Selection',
        description: 'Please select a date and time for your verification call.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, you would save this to a database
    console.log('Verification call booked for', {
      date,
      time: selectedTime,
    });
    
    toast({
      title: 'Verification Call Scheduled!',
      description: `Your call is scheduled for ${date.toLocaleDateString()} at ${selectedTime}. You will receive an email with the details.`,
    });

    router.push('/dashboard');
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:underline mb-4">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Schedule Verification Call</CardTitle>
          <CardDescription>Select a date and time for your one-on-one video verification.</CardDescription>
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
            <h3 className="font-semibold mb-2">2. Select a Time (3 PM - 6 PM)</h3>
            {date ? (
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className={cn(selectedTime === time && 'bg-primary text-primary-foreground')}
                      onClick={() => setSelectedTime(time)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {new Date(`1970-01-01T${time}:00`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                    </Button>
                  ))
                }
              </div>
            ) : (
               <p className="text-sm text-muted-foreground">Please select a date to see available times.</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" onClick={handleBooking} disabled={!date || !selectedTime}>
            Confirm Verification Call
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
