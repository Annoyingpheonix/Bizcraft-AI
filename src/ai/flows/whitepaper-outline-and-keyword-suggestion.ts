'use server';

/**
 * @fileOverview Generates a whitepaper outline, keywords, and content using AI.
 *
 * - whitepaperOutlineAndKeywords - A function that generates a whitepaper outline and keywords.
 * - WhitepaperOutlineAndKeywordsInput - The input type for the whitepaperOutlineAndKeywords function.
 * - WhitepaperOutlineAndKeywordsOutput - The return type for the whitepaperOutlineAndKeywords function.
 * - generateWhitepaperContent - A function that generates whitepaper content from an outline.
 * - WhitepaperContentInput - The input type for the generateWhitepaperContent function.
 * - WhitepaperContentOutput - The return type for the generateWhitepaperContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schemas for Outline & Keyword Generation
const WhitepaperOutlineAndKeywordsInputSchema = z.object({
  topic: z.string().describe('The topic of the whitepaper.'),
});
export type WhitepaperOutlineAndKeywordsInput = z.infer<
  typeof WhitepaperOutlineAndKeywordsInputSchema
>;

const WhitepaperOutlineAndKeywordsOutputSchema = z.object({
  outline: z.string().describe('The outline of the whitepaper.'),
  keywords: z.string().describe('Suggested keywords for SEO enhancement.'),
});
export type WhitepaperOutlineAndKeywordsOutput = z.infer<
  typeof WhitepaperOutlineAndKeywordsOutputSchema
>;

export async function whitepaperOutlineAndKeywords(
  input: WhitepaperOutlineAndKeywordsInput
): Promise<WhitepaperOutlineAndKeywordsOutput> {
  return whitepaperOutlineAndKeywordsFlow(input);
}

const outlinePrompt = ai.definePrompt({
  name: 'whitepaperOutlineAndKeywordsPrompt',
  input: {schema: WhitepaperOutlineAndKeywordsInputSchema},
  output: {schema: WhitepaperOutlineAndKeywordsOutputSchema},
  prompt: `You are an expert in creating whitepaper outlines and suggesting keywords for SEO.

  Based on the given topic, generate a detailed whitepaper outline with multiple sections and sub-sections.
  Also, suggest a list of relevant keywords that can be used to optimize the whitepaper for search engines.

  Topic: {{{topic}}}
  Outline:
  Keywords: `,
});

const whitepaperOutlineAndKeywordsFlow = ai.defineFlow(
  {
    name: 'whitepaperOutlineAndKeywordsFlow',
    inputSchema: WhitepaperOutlineAndKeywordsInputSchema,
    outputSchema: WhitepaperOutlineAndKeywordsOutputSchema,
  },
  async (input) => {
    const {output} = await outlinePrompt(input);
    return output!;
  }
);

// Schemas for Content Generation
const WhitepaperContentInputSchema = z.object({
  outline: z
    .string()
    .describe('The detailed whitepaper outline to generate content from.'),
  topic: z.string().describe('The topic of the whitepaper.'),
});
export type WhitepaperContentInput = z.infer<
  typeof WhitepaperContentInputSchema
>;

const WhitepaperContentOutputSchema = z.object({
  content: z
    .string()
    .describe('The full content of the whitepaper, formatted as markdown.'),
});
export type WhitepaperContentOutput = z.infer<
  typeof WhitepaperContentOutputSchema
>;

export async function generateWhitepaperContent(
  input: WhitepaperContentInput
): Promise<WhitepaperContentOutput> {
  return whitepaperContentFlow(input);
}

const contentPrompt = ai.definePrompt({
  name: 'whitepaperContentPrompt',
  input: {schema: WhitepaperContentInputSchema},
  output: {schema: WhitepaperContentOutputSchema},
  prompt: `You are a professional writer specializing in technical and business whitepapers.
Based on the given topic and outline, write a complete whitepaper.
The output should be the full text of the whitepaper, with clear headings for sections and sub-sections as defined in the outline.
Ensure the content is well-researched, authoritative, and formatted as markdown.

Topic: {{{topic}}}

Outline:
{{{outline}}}

Whitepaper Content (Markdown):
`,
});

const whitepaperContentFlow = ai.defineFlow(
  {
    name: 'whitepaperContentFlow',
    inputSchema: WhitepaperContentInputSchema,
    outputSchema: WhitepaperContentOutputSchema,
  },
  async (input) => {
    const {output} = await contentPrompt(input);
    return output!;
  }
);
