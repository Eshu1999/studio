'use server';

import { summarizeConsultation } from '@/ai/flows/summarize-consultation';
import { z } from 'zod';

const transcriptSchema = z.object({
  transcript: z.string(),
});

export async function generateSummaryAction(formData: FormData) {
  const rawTranscript = {
    transcript: formData.get('transcript'),
  };

  const validation = transcriptSchema.safeParse(rawTranscript);

  if (!validation.success) {
    return { error: 'Invalid transcript provided.' };
  }

  try {
    const result = await summarizeConsultation({ consultationTranscript: validation.data.transcript });
    return { summary: result.summary };
  } catch (error) {
    console.error('Error summarizing consultation:', error);
    return { error: 'Failed to generate summary. Please try again.' };
  }
}
