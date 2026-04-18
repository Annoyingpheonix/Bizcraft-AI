"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateEbookOutline,
  EbookOutlineInput,
  EbookOutlineOutput,
  generateEbookContent,
  EbookContentInput,
  EbookContentOutput,
} from '@/ai/flows/ebook-outline-generation';
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

const ebookFormSchema = z.object({
  topic: z.string().min(10, 'Please provide a detailed topic.'),
});

export function EbookGeneratorForm() {
  const [isOutlineLoading, setIsOutlineLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [outlineResult, setOutlineResult] = useState<EbookOutlineOutput | null>(
    null
  );
  const [contentResult, setContentResult] = useState<EbookContentOutput | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<EbookOutlineInput>({
    resolver: zodResolver(ebookFormSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onOutlineSubmit(values: EbookOutlineInput) {
    setIsOutlineLoading(true);
    setOutlineResult(null);
    setContentResult(null);
    try {
      const output = await generateEbookOutline(values);
      setOutlineResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate e-book outline. Please try again.',
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
      const input: EbookContentInput = {
        outline: outlineResult.outline,
        topic: form.getValues('topic'),
      };
      const output = await generateEbookContent(input);
      setContentResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate e-book content. Please try again.',
      });
    } finally {
      setIsContentLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            E-book Outline Generator
          </CardTitle>
          <CardDescription>
            Kickstart your e-book writing process. Provide a topic, and our AI will create a comprehensive chapter-by-chapter outline.
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
                    <FormLabel>E-book Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., A Beginner's Guide to Digital Marketing"
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
                Generate Outline
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
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline">
                Generated E-book Outline
              </CardTitle>
              <CopyButton textToCopy={outlineResult.outline} />
            </div>
            <CardDescription>
              Step 1: Review your generated outline. Step 2: Generate the full e-book content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-md border bg-muted p-4 text-muted-foreground">
              {outlineResult.outline}
            </div>
            <Button onClick={onContentSubmit} disabled={isContentLoading}>
              {isContentLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate E-book From Outline
            </Button>
          </CardContent>
        </Card>
      )}

      {isContentLoading && (
        <div className="flex items-center justify-center rounded-lg border p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-4 text-muted-foreground">Generating e-book content...</p>
        </div>
      )}

      {contentResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline">
                Generated E-book Content
              </CardTitle>
              <CopyButton textToCopy={contentResult.content} />
            </div>
            <CardDescription>
              Your complete e-book content is ready. You can copy the content below.
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
