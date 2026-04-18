'use server';

/**
 * @fileOverview A flow for summarizing text content for infographics.
 *
 * - summarizeInfographicContent - A function that summarizes text content for infographics.
 * - InfographicContentSummarizationInput - The input type for the summarizeInfographicContent function.
 * - InfographicContentSummarizationOutput - The return type for the summarizeInfographicContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InfographicContentSummarizationInputSchema = z.object({
  text: z
    .string()
    .describe('The text content to summarize for the infographic.'),
});
export type InfographicContentSummarizationInput = z.infer<typeof InfographicContentSummarizationInputSchema>;

const InfographicContentSummarizationOutputSchema = z.object({
  summary: z
    .string()
    .describe('The summarized text content for the infographic.'),
});
export type InfographicContentSummarizationOutput = z.infer<typeof InfographicContentSummarizationOutputSchema>;

export async function summarizeInfographicContent(input: InfographicContentSummarizationInput): Promise<InfographicContentSummarizationOutput> {
  return infographicContentSummarizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'infographicContentSummarizationPrompt',
  input: {schema: InfographicContentSummarizationInputSchema},
  output: {schema: InfographicContentSummarizationOutputSchema},
  prompt: `Summarize the following text content for an infographic:

{{{text}}}
`,
});

const infographicContentSummarizationFlow = ai.defineFlow(
  {
    name: 'infographicContentSummarizationFlow',
    inputSchema: InfographicContentSummarizationInputSchema,
    outputSchema: InfographicContentSummarizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
