
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DoctorCard } from '@/components/doctor-card';
import { doctors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeartPulse } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm border-b fixed top-0 w-full z-50">
        <Link href="/" className="flex items-center justify-center">
          <HeartPulse className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold">DocConnect</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            href="/#features"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#doctors"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Doctors
          </Link>
           <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Button asChild>
            <Link href="/doctors">Book Now</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 pt-16">
        <section className="relative w-full py-20 md:py-32 lg:py-40 bg-background">
          <div className="container px-4 md:px-6 relative z-10 text-center text-foreground">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Your Health, Your Schedule
              </h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                Easily book appointments with trusted medical professionals.
                Quality healthcare is just a click away.
              </p>
              <div className="mt-6">
                <Button size="lg" asChild>
                  <Link href="/doctors">Book an Appointment</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
              How It Works
            </h2>
            <div className="mx-auto grid max-w-5xl items-start gap-12 mt-12 sm:grid-cols-3">
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">1. Find Your Doctor</h3>
                <p className="text-sm text-muted-foreground">
                  Browse profiles, specializations, and available time slots.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">2. Book an Appointment</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a convenient time and book your virtual consultation securely.
                </p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-lg font-bold">3. Start Your Video Call</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with your doctor for a private and secure video consultation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} DocConnect. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
