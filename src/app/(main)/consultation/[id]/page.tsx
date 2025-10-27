'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { appointments, doctors, patients } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { ConsultationSummary } from '@/components/consultation-summary';

export default function ConsultationPage() {
  const [callActive, setCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const params = useParams<{ id: string }>();

  const appointment = appointments.find((a) => a.id === params.id);
  if (!appointment) notFound();

  const doctor = doctors.find((d) => d.id === appointment.doctorId);
  if (!doctor) notFound();
  
  const patient = patients.find(p => p.id === appointment.patientId);
  if (!patient) notFound();


  const patientVideoImg = PlaceHolderImages.find((i) => i.id === 'patient-video');
  const doctorVideoImg = PlaceHolderImages.find((i) => i.id === 'doctor-video');

  const mockTranscript = `Patient: Good morning, Doctor. I've been having some chest pain lately.
Doctor: I see. Can you describe the pain? Is it sharp, dull, a pressure?
Patient: It's more like a pressure, right in the center of my chest. It seems to happen when I walk up hills.
Doctor: How long does it last?
Patient: About 5 minutes, and it goes away when I rest.
Doctor: Any other symptoms? Shortness of breath, dizziness?
Patient: Sometimes I feel a bit short of breath with it. No dizziness.
Doctor: Okay. Based on your symptoms, I'm concerned about angina. I'd like to schedule an ECG and a stress test to evaluate your heart. We'll also check your cholesterol levels. In the meantime, I'm prescribing you a medication to help with the symptoms.`;


  if (!callActive) {
    return (
      <ConsultationSummary 
        doctorName={doctor.name}
        patientName={appointment.patientName}
        consultationDate={appointment.date}
        transcript={mockTranscript}
      />
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-10rem)] bg-card rounded-lg border">
      <header className="p-4 border-b">
        <h1 className="text-lg font-semibold">Consultation with {doctor.name}</h1>
        <p className="text-sm text-muted-foreground">Appointment for {appointment.patientName}</p>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2 relative">
        <div className="relative rounded-lg overflow-hidden bg-black">
          {doctorVideoImg && !videoOff && (
            <Image src={doctorVideoImg.imageUrl} alt={doctor.name} layout="fill" objectFit="cover" data-ai-hint={doctorVideoImg.imageHint} />
          )}
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
            {doctor.name}
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden bg-black">
          {patientVideoImg && (
            <Image src={patient.avatar} alt={patient.name} layout="fill" objectFit="cover" data-ai-hint={'person smiling'} />
          )}
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
            {patient.name}
          </div>
        </div>
      </div>
      <footer className="p-4 border-t flex justify-center items-center gap-4 bg-secondary/30 rounded-b-lg">
        <Button variant={isMuted ? 'destructive' : 'outline'} size="icon" className="rounded-full h-12 w-12" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <MicOff /> : <Mic />}
        </Button>
        <Button variant={videoOff ? 'destructive' : 'outline'} size="icon" className="rounded-full h-12 w-12" onClick={() => setVideoOff(!videoOff)}>
          {videoOff ? <VideoOff /> : <Video />}
        </Button>
        <Button variant="destructive" size="icon" className="rounded-full h-14 w-14" onClick={() => setCallActive(false)}>
          <PhoneOff />
        </Button>
      </footer>
    </div>
  );
}
