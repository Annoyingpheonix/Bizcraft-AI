"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateSocialMediaPost,
  SocialMediaPostInput,
  SocialMediaPostOutput,
} from '@/ai/flows/social-media-post-generation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CopyButton } from '@/components/copy-button';
import { Badge } from '@/components/ui/badge';

const socialMediaFormSchema = z.object({
  topic: z.string().min(10, 'Topic must be at least 10 characters.'),
  platform: z.string({ required_error: 'Please select a platform.' }),
  tone: z.string({ required_error: 'Please select a tone.' }),
  includeHashtags: z.boolean().default(true).optional(),
});

export function SocialMediaPostGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SocialMediaPostOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof socialMediaFormSchema>>({
    resolver: zodResolver(socialMediaFormSchema),
    defaultValues: {
      topic: '',
      includeHashtags: true,
    },
  });

  async function onSubmit(values: z.infer<typeof socialMediaFormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await generateSocialMediaPost(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate post. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Social Media Post Generator</CardTitle>
          <CardDescription>
            Craft the perfect social media post. Just provide a topic, choose your platform and tone, and let AI do the rest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic / Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is your post about? e.g., Announcing our new product feature..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                 <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Twitter">Twitter / X</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                           <SelectItem value="Instagram">Instagram</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone of Voice</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Casual">Casual</SelectItem>
                          <SelectItem value="Witty">Witty</SelectItem>
                          <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                          <SelectItem value="Formal">Formal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="includeHashtags"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Include Hashtags
                      </FormLabel>
                      <FormDescription>
                        Let the AI suggest relevant hashtags to increase your post's visibility.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Post
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
            <CardTitle className="font-headline">Generated Post</CardTitle>
            <CardDescription>
              Here is your AI-generated social media post.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Post Content</h3>
                <CopyButton textToCopy={result.post} />
              </div>
              <div className="whitespace-pre-wrap rounded-md border bg-muted p-4 text-sm text-muted-foreground">
                {result.post}
              </div>
            </div>
            {result.hashtags && (
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Suggested Hashtags</h3>
                  <CopyButton textToCopy={result.hashtags} />
                </div>
                <div className="flex flex-wrap gap-2 rounded-md border bg-muted p-4">
                  {result.hashtags.split(',').map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
