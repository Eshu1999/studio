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
import { X, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [duration, setDuration] = useState('30');

  const selectedDateString = date ? date.toISOString().split('T')[0] : '';
  const timeSlotsForSelectedDate = availability[selectedDateString] || [];

  const handleGenerateSlots = () => {
    if (!date) {
      toast({ title: 'Error', description: 'Please select a date first.', variant: 'destructive'});
      return;
    }
    if (!startTime || !endTime || !duration) {
      toast({ title: 'Error', description: 'Please fill in start time, end time, and duration.', variant: 'destructive'});
      return;
    }

    const start = new Date(`${selectedDateString}T${startTime}`);
    const end = new Date(`${selectedDateString}T${endTime}`);
    const durationMinutes = parseInt(duration, 10);

    if (start >= end) {
        toast({ title: 'Error', description: 'End time must be after start time.', variant: 'destructive'});
        return;
    }

    const generatedSlots: string[] = [];
    let currentTime = new Date(start);

    while (currentTime < end) {
        generatedSlots.push(currentTime.toTimeString().substring(0, 5));
        currentTime.setMinutes(currentTime.getMinutes() + durationMinutes);
    }
    
    setAvailability(prev => ({
        ...prev,
        [selectedDateString]: generatedSlots,
    }));

    toast({ title: 'Success', description: `Generated ${generatedSlots.length} slots for ${date.toLocaleDateString()}.`});
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

  const handleSaveChanges = () => {
     // In a real app, this would save the `availability` object to Firestore
     toast({ title: 'Changes Saved', description: 'Your availability has been updated.'});
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
            <h3 className="font-semibold mb-4 text-lg">2. Set Your Hours</h3>
            {date ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set your working hours for: <span className="font-semibold text-foreground">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="start-time">Start Time</Label>
                          <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="end-time">End Time</Label>
                          <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                      </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label>Meeting Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleGenerateSlots} className="mt-4 w-full">
                    <Clock className="mr-2 h-4 w-4" />
                    Generate Slots
                  </Button>
                </div>

                <div className="space-y-2">
                    <h4 className="font-medium">Generated Slots:</h4>
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
                        <p className="text-sm text-muted-foreground border rounded-md p-4 text-center">No slots generated for this day.</p>
                    )}
                </div>
                 <div className="pt-4">
                  <Button onClick={handleSaveChanges}>Save Changes for this Date</Button>
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
