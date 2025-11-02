
'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LifeBuoy, BookUser } from 'lucide-react';

export default function HelpPage() {
    const faqs = [
        {
            question: "How do I book an appointment?",
            answer: "To book an appointment, go to the 'Doctors' page, find a doctor you'd like to see, view their profile, and click the 'Book an Appointment' button. You can then select an available date and time slot."
        },
        {
            question: "How can I view my upcoming appointments?",
            answer: "You can view all your upcoming appointments on your 'Dashboard' or by navigating to the 'Appointments' page and selecting the 'Upcoming' tab."
        },
        {
            question: "How do I join a video consultation?",
            answer: "For your upcoming appointments, a 'Join Call' button will appear on the dashboard and the appointments list shortly before the scheduled time. Click this button to enter the virtual consultation room."
        },
        {
            question: "Where can I find the summary of my past consultations?",
            answer: "Navigate to the 'Consultations' page. Here you will find a list of all completed consultations. Click 'View Summary' to see the details and the AI-generated notes."
        },
        {
            question: "How do I cancel or reschedule an appointment?",
            answer: "Currently, to cancel or reschedule, please contact our support team through the contact form below. We are working on adding self-service cancellation and rescheduling features."
        }
    ];

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
                <p className="text-muted-foreground">
                    Find answers to common questions or get in touch with our support team.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <div className="relative mt-2">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search FAQs..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>
                        Can't find the answer you're looking for? Our team is here to help.
                    </CardDescription>
                </CardHeader>
                 <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4 justify-center">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-md text-primary">
                                <LifeBuoy className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Live Chat</h3>
                                <p className="text-sm text-muted-foreground">Get instant help from our support agents. Average wait time: <strong>2 minutes</strong>.</p>
                                <Button className="mt-2" size="sm">Start Chat</Button>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                             <div className="p-2 bg-primary/10 rounded-md text-primary">
                                <BookUser className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Email Support</h3>
                                <p className="text-sm text-muted-foreground">Send us an email and we'll get back to you within 24 hours.</p>
                                 <Button variant="outline" className="mt-2" size="sm" asChild>
                                    <a href="mailto:support@faylocare.app">support@faylocare.app</a>
                                 </Button>
                            </div>
                        </div>
                    </div>
                     <div className="flex flex-col gap-4">
                         <Input placeholder="Your Name" />
                         <Input type="email" placeholder="Your Email" />
                         <textarea placeholder="Describe your issue..." className="min-h-[120px] p-2 border rounded-md text-sm"></textarea>
                         <Button>Send Message</Button>
                     </div>
                 </CardContent>
            </Card>
        </div>
    );
}
