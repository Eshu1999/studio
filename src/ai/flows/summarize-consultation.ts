'use server';

/**
 * @fileOverview Summarizes the key points of a video consultation.
 *
 * - summarizeConsultation - A function that summarizes a video consultation.
 * - SummarizeConsultationInput - The input type for the summarizeConsultation function.
 * - SummarizeConsultationOutput - The return type for the summarizeConsultation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConsultationInputSchema = z.object({
  consultationTranscript: z
    .string()
    .describe('The transcript of the video consultation.'),
});
export type SummarizeConsultationInput = z.infer<typeof SummarizeConsultationInputSchema>;

const SummarizeConsultationOutputSchema = z.object({
  summary: z.string().describe('A summary of the key points discussed.'),
});
export type SummarizeConsultationOutput = z.infer<typeof SummarizeConsultationOutputSchema>;

export async function summarizeConsultation(
  input: SummarizeConsultationInput
): Promise<SummarizeConsultationOutput> {
  return summarizeConsultationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeConsultationPrompt',
  input: {schema: SummarizeConsultationInputSchema},
  output: {schema: SummarizeConsultationOutputSchema},
  prompt: `You are an AI assistant to a doctor summarizing the key points of a video consultation with a patient.  The doctor will use this summary to quickly recall the consultation and save it to the patient's record.

  Summarize the key points discussed in the following consultation transcript:

  Transcript: {{{consultationTranscript}}}`,
});

const summarizeConsultationFlow = ai.defineFlow(
  {
    name: 'summarizeConsultationFlow',
    inputSchema: SummarizeConsultationInputSchema,
    outputSchema: SummarizeConsultationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
