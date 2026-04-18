'use server';

/**
 * @fileOverview A logo design generation AI agent.
 *
 * - generateLogo - A function that handles the logo generation process.
 * - LogoDesignInput - The input type for the generateLogo function.
 * - LogoDesignOutput - The return type for the generateLogo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LogoDesignInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  industry: z.string().describe('The industry of the business.'),
  aestheticPreferences: z.string().describe('The desired aesthetic preferences for the logo.'),
});
export type LogoDesignInput = z.infer<typeof LogoDesignInputSchema>;

const LogoVariationSchema = z.object({
  logoSvg: z.string().describe('The logo as an SVG string.'),
  description: z.string().describe('A description of the generated logo.'),
});

const LogoDesignOutputSchema = z.object({
  logos: z.array(LogoVariationSchema).describe('A list of 3 generated logo variations.'),
});
export type LogoDesignOutput = z.infer<typeof LogoDesignOutputSchema>;


export async function generateLogo(input: LogoDesignInput): Promise<LogoDesignOutput> {
  return logoDesignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'logoDesignPrompt',
  input: {schema: LogoDesignInputSchema},
  output: {schema: LogoDesignOutputSchema},
  prompt: `You are a logo design expert. Generate 3 unique and simple SVG logo variations based on the following information. Each SVG should be a single block of code, without any markdown formatting. Ensure the designs avoid copyrighted or trademarked content.

Business Name: {{{businessName}}}
Industry: {{{industry}}}
Aesthetic Preferences: {{{aestheticPreferences}}}

For each variation, provide a unique design and a short description. All SVGs should be valid, well-formatted, and self-contained without any raster images.
`,
});

const logoDesignFlow = ai.defineFlow(
  {
    name: 'logoDesignFlow',
    inputSchema: LogoDesignInputSchema,
    outputSchema: LogoDesignOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
