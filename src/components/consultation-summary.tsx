'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateSummaryAction } from '@/app/actions';
import { Loader2, Sparkles, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ConsultationSummaryProps = {
    doctorName: string;
    patientName: string;
    consultationDate: string;
    transcript: string;
}

export function ConsultationSummary({ doctorName, patientName, consultationDate, transcript }: ConsultationSummaryProps) {
    const [summary, setSummary] = useState('');
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleGenerateSummary = async () => {
        const formData = new FormData();
        formData.append('transcript', transcript);

        startTransition(async () => {
            const result = await generateSummaryAction(formData);
            if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                });
            } else if (result.summary) {
                setSummary(result.summary);
                toast({
                    title: "Summary Generated!",
                    description: "The consultation summary is ready for review.",
                });
            }
        });
    };

    const handleSave = () => {
      // In a real app, you would save this to a database
      console.log('Saving summary:', summary);
      toast({
        title: 'Summary Saved',
        description: 'The consultation notes have been saved to the patient\'s record.',
      });
    }

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Consultation Summary</CardTitle>
                    <CardDescription>
                        Review and save the AI-generated summary of your consultation with {patientName} on {new Date(consultationDate).toLocaleDateString()}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Button onClick={handleGenerateSummary} disabled={isPending} className="w-full md:w-auto">
                            {isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                            ) : (
                                <><Sparkles className="mr-2 h-4 w-4" /> Generate AI Summary</>
                            )}
                        </Button>
                    </div>
                    <Textarea
                        placeholder="AI-generated summary will appear here..."
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="min-h-[250px] text-base"
                    />
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} disabled={!summary || isPending}>
                        <Save className="mr-2 h-4 w-4" /> Save to Patient Record
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
