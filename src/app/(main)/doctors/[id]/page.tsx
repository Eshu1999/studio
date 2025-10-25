import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { doctors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Star, CalendarDays } from 'lucide-react';

export default function DoctorProfilePage({ params }: { params: { id: string } }) {
  const doctor = doctors.find((d) => d.id === params.id);

  if (!doctor) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === doctor.imageId);

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            {image && (
              <Image
                src={image.imageUrl}
                alt={doctor.name}
                width={400}
                height={600}
                className="h-full w-full object-cover"
                data-ai-hint={image.imageHint}
              />
            )}
            <div className="absolute top-4 right-4 bg-background/80 p-2 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold">4.9</span>
                    <span className="text-xs text-muted-foreground">(234 reviews)</span>
                </div>
            </div>
          </div>
          <div className="md:w-2/3 p-6 flex flex-col">
            <Badge variant="secondary" className="w-fit">{doctor.specialization}</Badge>
            <h1 className="text-3xl font-bold mt-2">{doctor.name}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              {doctor.experience} years of experience
            </p>
            <p className="mt-4 text-sm text-foreground/80 flex-grow">
              {doctor.bio}
            </p>
            <div className="mt-6">
              <Button size="lg" asChild className="w-full md:w-auto">
                <Link href={`/book/${doctor.id}`}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Book an Appointment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About Dr. {doctor.name.split(' ').pop()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
            <div>
                <h3 className="font-semibold">Specialization</h3>
                <p className="text-muted-foreground">{doctor.specialization}</p>
            </div>
            <div>
                <h3 className="font-semibold">Experience</h3>
                <p className="text-muted-foreground">{doctor.experience} years in practice</p>
            </div>
             <div>
                <h3 className="font-semibold">Education</h3>
                <p className="text-muted-foreground">MD from Stanford University School of Medicine</p>
            </div>
             <div>
                <h3 className="font-semibold">Languages</h3>
                <p className="text-muted-foreground">English, Spanish</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
