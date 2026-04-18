'use server';

/**
 * @fileOverview Generates an ebook outline and content using AI.
 *
 * - generateEbookOutline - A function that generates an ebook outline.
 * - EbookOutlineInput - The input type for the generateEbookOutline function.
 * - EbookOutlineOutput - The return type for the generateEbookOutline function.
 * - generateEbookContent - A function that generates ebook content from an outline.
 * - EbookContentInput - The input type for the generateEbookContent function.
 * - EbookContentOutput - The return type for the generateEbookContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schemas for Outline Generation
const EbookOutlineInputSchema = z.object({
  topic: z.string().describe('The topic of the ebook.'),
});
export type EbookOutlineInput = z.infer<typeof EbookOutlineInputSchema>;

const EbookOutlineOutputSchema = z.object({
  outline: z
    .string()
    .describe('The outline of the ebook, formatted nicely for display.'),
});
export type EbookOutlineOutput = z.infer<typeof EbookOutlineOutputSchema>;

export async function generateEbookOutline(
  input: EbookOutlineInput
): Promise<EbookOutlineOutput> {
  return ebookOutlineFlow(input);
}

const outlinePrompt = ai.definePrompt({
  name: 'ebookOutlinePrompt',
  input: {schema: EbookOutlineInputSchema},
  output: {schema: EbookOutlineOutputSchema},
  prompt: `You are an expert in creating ebook outlines.

  Based on the given topic, generate a detailed ebook outline with multiple chapters and sections within each chapter.
  Format the output as a structured list.

  Topic: {{{topic}}}
  Outline:
  `,
});

const ebookOutlineFlow = ai.defineFlow(
  {
    name: 'ebookOutlineFlow',
    inputSchema: EbookOutlineInputSchema,
    outputSchema: EbookOutlineOutputSchema,
  },
  async (input) => {
    const {output} = await outlinePrompt(input);
    return output!;
  }
);

// Schemas for Content Generation
const EbookContentInputSchema = z.object({
  outline: z
    .string()
    .describe('The detailed ebook outline to generate content from.'),
  topic: z.string().describe('The topic of the ebook.'),
});
export type EbookContentInput = z.infer<typeof EbookContentInputSchema>;

const EbookContentOutputSchema = z.object({
  content: z
    .string()
    .describe('The full content of the ebook, formatted as markdown.'),
});
export type EbookContentOutput = z.infer<typeof EbookContentOutputSchema>;

export async function generateEbookContent(
  input: EbookContentInput
): Promise<EbookContentOutput> {
  return ebookContentFlow(input);
}

const contentPrompt = ai.definePrompt({
  name: 'ebookContentPrompt',
  input: {schema: EbookContentInputSchema},
  output: {schema: EbookContentOutputSchema},
  prompt: `You are a professional author. Based on the given topic and outline, write a complete ebook.
The output should be the full text of the ebook, with clear headings for chapters and sections as defined in the outline.
Ensure the content is comprehensive, well-structured, engaging, and formatted as markdown.

Topic: {{{topic}}}

Outline:
{{{outline}}}

E-book Content (Markdown):
`,
});

const ebookContentFlow = ai.defineFlow(
  {
    name: 'ebookContentFlow',
    inputSchema: EbookContentInputSchema,
    outputSchema: EbookContentOutputSchema,
  },
  async (input) => {
    const {output} = await contentPrompt(input);
    return output!;
  }
);
