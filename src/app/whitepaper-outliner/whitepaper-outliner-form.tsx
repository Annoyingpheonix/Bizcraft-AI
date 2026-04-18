"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  whitepaperOutlineAndKeywords,
  WhitepaperOutlineAndKeywordsInput,
  WhitepaperOutlineAndKeywordsOutput,
  generateWhitepaperContent,
  WhitepaperContentInput,
  WhitepaperContentOutput,
} from '@/ai/flows/whitepaper-outline-and-keyword-suggestion';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CopyButton } from '@/components/copy-button';
import { Badge } from '@/components/ui/badge';

const whitepaperFormSchema = z.object({
  topic: z.string().min(10, 'Please provide a detailed topic.'),
});

export function WhitepaperOutlinerForm() {
  const [isOutlineLoading, setIsOutlineLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [outlineResult, setOutlineResult] =
    useState<WhitepaperOutlineAndKeywordsOutput | null>(null);
  const [contentResult, setContentResult] =
    useState<WhitepaperContentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<WhitepaperOutlineAndKeywordsInput>({
    resolver: zodResolver(whitepaperFormSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onOutlineSubmit(values: WhitepaperOutlineAndKeywordsInput) {
    setIsOutlineLoading(true);
    setOutlineResult(null);
    setContentResult(null);
    try {
      const output = await whitepaperOutlineAndKeywords(values);
      setOutlineResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate outline. Please try again.',
      });
    } finally {
      setIsOutlineLoading(false);
    }
  }

  async function onContentSubmit() {
    if (!outlineResult || !form.getValues('topic')) return;

    setIsContentLoading(true);
    setContentResult(null);
    try {
      const input: WhitepaperContentInput = {
        outline: outlineResult.outline,
        topic: form.getValues('topic'),
      };
      const output = await generateWhitepaperContent(input);
      setContentResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate whitepaper content. Please try again.',
      });
    } finally {
      setIsContentLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Whitepaper Outliner</CardTitle>
          <CardDescription>
            Start your next whitepaper with a solid foundation. Enter a topic to generate a detailed outline and a list of SEO-friendly keywords.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onOutlineSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Whitepaper Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., The Impact of AI on Modern Marketing Strategies"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isOutlineLoading}>
                {isOutlineLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Outline & Keywords
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isOutlineLoading && (
        <div className="flex items-center justify-center rounded-lg border p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {outlineResult && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Generated Content</CardTitle>
            <CardDescription>
              Step 1: Review your outline and keywords. Step 2: Generate the full whitepaper.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Whitepaper Outline</h3>
                <CopyButton textToCopy={outlineResult.outline} />
              </div>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-md border bg-muted p-4 text-muted-foreground">
                {outlineResult.outline}
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Suggested Keywords</h3>
                <CopyButton textToCopy={outlineResult.keywords} />
              </div>
              <div className="flex flex-wrap gap-2 rounded-md border bg-muted p-4">
                {outlineResult.keywords.split(',').map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword.trim()}
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={onContentSubmit} disabled={isContentLoading}>
              {isContentLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Whitepaper From Outline
            </Button>
          </CardContent>
        </Card>
      )}

      {isContentLoading && (
        <div className="flex items-center justify-center rounded-lg border p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
           <p className="ml-4 text-muted-foreground">Generating whitepaper content...</p>
        </div>
      )}

      {contentResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline">
                Generated Whitepaper Content
              </CardTitle>
              <CopyButton textToCopy={contentResult.content} />
            </div>
            <CardDescription>
              Your complete whitepaper is ready. You can copy the content below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-md border bg-muted p-4 text-muted-foreground">
              {contentResult.content}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
