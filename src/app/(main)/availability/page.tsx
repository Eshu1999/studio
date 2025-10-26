'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

// Mock availability data. In a real app, this would come from Firestore.
const initialAvailability: Record<string, string[]> = {
  '2024-07-29': ['09:00', '10:00', '11:00', '14:00'],
  '2024-07-30': ['09:30', '10:30', '14:30', '15:30'],
  '2024-07-31': ['10:00', '11:00', '12:00'],
};

export default function AvailabilityPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState(initialAvailability);
  const [newTime, setNewTime] = useState('');

  const selectedDateString = date ? date.toISOString().split('T')[0] : '';
  const timeSlotsForSelectedDate = availability[selectedDateString] || [];

  const handleAddTime = () => {
    if (!date) {
      toast({ title: 'Error', description: 'Please select a date first.', variant: 'destructive'});
      return;
    }
    if (!newTime.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
        toast({ title: 'Error', description: 'Please enter a valid time in HH:MM format (e.g., 09:30).', variant: 'destructive'});
        return;
    }

    const updatedSlots = [...timeSlotsForSelectedDate, newTime].sort();
    
    setAvailability(prev => ({
        ...prev,
        [selectedDateString]: updatedSlots,
    }));
    setNewTime('');
    toast({ title: 'Success', description: `Added slot ${newTime} for ${date.toLocaleDateString()}.`});
  };
  
  const handleRemoveTime = (timeToRemove: string) => {
    if (!date) return;
    const updatedSlots = timeSlotsForSelectedDate.filter(time => time !== timeToRemove);
    setAvailability(prev => ({
        ...prev,
        [selectedDateString]: updatedSlots,
    }));
     toast({ title: 'Slot Removed', description: `Removed slot ${timeToRemove}.`});
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Availability</h1>
        <p className="text-muted-foreground">
          Set the days and times you are available for consultations.
        </p>
      </div>

      <Card>
        <CardContent className="p-6 grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-4 text-lg">1. Select a Date</h3>
            <div className="rounded-md border">
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
            <h3 className="font-semibold mb-4 text-lg">2. Manage Time Slots</h3>
            {date ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Editing slots for: <span className="font-semibold text-foreground">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </p>
                 <div className="flex items-center gap-2">
                    <Input 
                        type="time" 
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-48"
                    />
                    <Button onClick={handleAddTime} size="icon">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-2">
                    <h4 className="font-medium">Available Slots:</h4>
                    {timeSlotsForSelectedDate.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {timeSlotsForSelectedDate.map(time => (
                                <Badge key={time} variant="secondary" className="text-base font-normal py-1 pr-1 pl-3">
                                    {time}
                                    <button onClick={() => handleRemoveTime(time)} className="ml-2 rounded-full p-0.5 hover:bg-muted-foreground/20">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No slots scheduled for this day.</p>
                    )}
                </div>
                 <div className="pt-4">
                  <Button>Save Changes</Button>
                </div>
              </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center pt-16">Please select a date to manage time slots.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
