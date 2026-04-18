
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  summarizeInfographicContent,
  InfographicContentSummarizationInput,
  InfographicContentSummarizationOutput,
} from '@/ai/flows/infographic-content-summarization';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CopyButton } from '@/components/copy-button';

const infographicFormSchema = z.object({
  text: z
    .string()
    .min(50, 'Please provide at least 50 characters of text to summarize.'),
});

export function InfographicDesignerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] =
    useState<InfographicContentSummarizationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<InfographicContentSummarizationInput>({
    resolver: zodResolver(infographicFormSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: InfographicContentSummarizationInput) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await summarizeInfographicContent(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Failed to summarize content. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            Infographic Content Summarizer
          </CardTitle>
          <CardDescription>
            Turn long-form text into bite-sized, infographic-ready content. Paste your article or report below to get a summary of key points.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text to Summarize</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your article, report, or any text content here..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Summarize Content
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center rounded-lg border p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline">
                Summarized Content
              </CardTitle>
              <CopyButton textToCopy={result.summary} />
            </div>
            <CardDescription>
              Here are the key points from your text, perfect for an infographic. You can also use this as a starting point for a visual design.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-md border bg-muted p-4 text-muted-foreground">
              {result.summary}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
