
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateAdCopy,
  AdCopyInput,
  AdCopyOutput,
} from '@/ai/flows/ad-copy-generation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CopyButton } from '@/components/copy-button';

const adCopyFormSchema = z.object({
  businessType: z.string().min(3, 'Business type is required.'),
  targetAudience: z.string().min(3, 'Target audience is required.'),
  platform: z.string().min(2, 'Platform is required.'),
  productDescription: z.string().min(10, 'Product description is required.'),
  keywords: z.string().min(3, 'Keywords are required.'),
  recentHeadline: z.string().optional(),
});

export function AdGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AdCopyOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<AdCopyInput>({
    resolver: zodResolver(adCopyFormSchema),
    defaultValues: {
      businessType: '',
      targetAudience: '',
      platform: '',
      productDescription: '',
      keywords: '',
      recentHeadline: '',
    },
  });

  async function onSubmit(values: AdCopyInput) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await generateAdCopy(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate ad copy. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Ad Copy Generator</CardTitle>
          <CardDescription>
            Fill in the details about your product and target audience to generate compelling ad copy tailored for your chosen platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SaaS, E-commerce" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Small business owners"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Platform</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Facebook, Google Ads, LinkedIn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product/Service Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your product or service in detail."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., AI tools, marketing, automation"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated keywords related to your product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recentHeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inspirational Headline (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A recent high-performing ad headline"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a successful headline for AI inspiration.
                    </FormDescription>
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
                Generate Ad
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
            <CardTitle className="font-headline">Generated Ad Copy</CardTitle>
            <CardDescription>
              Here is the AI-generated ad copy. You can copy the content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Headline</h3>
                <CopyButton textToCopy={result.headline} />
              </div>
              <div className="whitespace-pre-wrap rounded-md border bg-muted p-4 text-sm text-muted-foreground">
                {result.headline}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Body</h3>
                <CopyButton textToCopy={result.body} />
              </div>
              <div className="whitespace-pre-wrap rounded-md border bg-muted p-4 text-sm text-muted-foreground">
                {result.body}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Call to Action</h3>
                <CopyButton textToCopy={result.callToAction} />
              </div>
              <div className="whitespace-pre-wrap rounded-md border bg-muted p-4 text-sm text-muted-foreground">
                {result.callToAction}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
