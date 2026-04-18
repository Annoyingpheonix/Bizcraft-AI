'use server';

/**
 * @fileOverview AI-powered ad copy generation flow.
 *
 * - generateAdCopy - A function that generates ad copy.
 * - AdCopyInput - The input type for the generateAdCopy function.
 * - AdCopyOutput - The return type for the generateAdCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdCopyInputSchema = z.object({
  businessType: z.string().describe('The type of business or industry.'),
  targetAudience: z.string().describe('Description of the target audience.'),
  platform: z.string().describe('The advertising platform (e.g., Google Ads, Facebook, LinkedIn).'),
  productDescription: z.string().describe('A detailed description of the product or service being advertised.'),
  keywords: z.string().describe('Keywords related to the product or service.'),
  recentHeadline: z.string().optional().describe('A recent high-performing marketing headline to use as inspiration.'),
});
export type AdCopyInput = z.infer<typeof AdCopyInputSchema>;

const AdCopyOutputSchema = z.object({
  headline: z.string().describe('The generated ad headline.'),
  body: z.string().describe('The generated ad body text.'),
  callToAction: z.string().describe('The suggested call to action for the ad.'),
});
export type AdCopyOutput = z.infer<typeof AdCopyOutputSchema>;

export async function generateAdCopy(input: AdCopyInput): Promise<AdCopyOutput> {
  return adCopyGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adCopyPrompt',
  input: {schema: AdCopyInputSchema},
  output: {schema: AdCopyOutputSchema},
  prompt: `You are an expert marketing copywriter. Generate compelling ad copy based on the following information for the {{platform}} platform, tailored to the specified target audience.

Business Type: {{businessType}}
Target Audience: {{targetAudience}}
Platform: {{platform}}
Product Description: {{productDescription}}
Keywords: {{keywords}}

{{#if recentHeadline}}
Use the following recent high-performing marketing headline as inspiration:
{{recentHeadline}}
{{/if}}

Ensure the ad copy is engaging, concise, and includes a clear call to action.
`,
});

const adCopyGenerationFlow = ai.defineFlow(
  {
    name: 'adCopyGenerationFlow',
    inputSchema: AdCopyInputSchema,
    outputSchema: AdCopyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
