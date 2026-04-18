'use server';

/**
 * @fileOverview AI-powered social media post generation flow.
 *
 * - generateSocialMediaPost - A function that generates social media posts.
 * - SocialMediaPostInput - The input type for the generateSocialMediaPost function.
 * - SocialMediaPostOutput - The return type for the generateSocialMediaPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SocialMediaPostInputSchema = z.object({
  topic: z.string().describe('The topic or main message of the post.'),
  platform: z.string().describe('The social media platform (e.g., Twitter, Facebook, LinkedIn).'),
  tone: z.string().describe('The desired tone for the post (e.g., Professional, Witty, Casual).'),
  includeHashtags: z.boolean().describe('Whether to include relevant hashtags.'),
});
export type SocialMediaPostInput = z.infer<typeof SocialMediaPostInputSchema>;

const SocialMediaPostOutputSchema = z.object({
  post: z.string().describe('The generated social media post content.'),
  hashtags: z.string().optional().describe('A comma-separated list of suggested hashtags.'),
});
export type SocialMediaPostOutput = z.infer<typeof SocialMediaPostOutputSchema>;

export async function generateSocialMediaPost(input: SocialMediaPostInput): Promise<SocialMediaPostOutput> {
  return socialMediaPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'socialMediaPostPrompt',
  input: {schema: SocialMediaPostInputSchema},
  output: {schema: SocialMediaPostOutputSchema},
  prompt: `You are a social media marketing expert. Generate a compelling post for the {{platform}} platform.

Topic: {{topic}}
Tone: {{tone}}

The post should be engaging and tailored for the {{platform}} audience.
{{#if includeHashtags}}
Please also suggest a few relevant hashtags.
{{/if}}
`,
});

const socialMediaPostFlow = ai.defineFlow(
  {
    name: 'socialMediaPostFlow',
    inputSchema: SocialMediaPostInputSchema,
    outputSchema: SocialMediaPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
