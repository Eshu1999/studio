import Image from 'next/image';
import Link from 'next/link';
import type { Doctor } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';
import { Badge } from './ui/badge';

type DoctorCardProps = {
  doctor: Doctor;
};

export function DoctorCard({ doctor }: DoctorCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === doctor.imageId);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
        {image && (
          <Image
            src={image.imageUrl}
            alt={doctor.name}
            width={400}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint={image.imageHint}
          />
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-bold">{doctor.name}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
          <Stethoscope className="w-4 h-4" />
          {doctor.specialization}
        </p>
        <Badge variant="secondary" className="mt-2">{doctor.experience} years experience</Badge>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/30">
        <Button asChild className="w-full">
          <Link href={`/doctors/${doctor.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
