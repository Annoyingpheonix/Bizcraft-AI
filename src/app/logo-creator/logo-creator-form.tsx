
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateLogo,
  LogoDesignInput,
  LogoDesignOutput,
} from '@/ai/flows/logo-design-generation';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Download, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const logoFormSchema = z.object({
  businessName: z.string().min(2, 'Business name is required.'),
  industry: z.string().min(3, 'Industry is required.'),
  aestheticPreferences: z
    .string()
    .min(10, 'Please describe your desired aesthetic.'),
});

export function LogoCreatorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LogoDesignOutput | null>(null);
  const [logoDataUris, setLogoDataUris] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<LogoDesignInput>({
    resolver: zodResolver(logoFormSchema),
    defaultValues: {
      businessName: '',
      industry: '',
      aestheticPreferences: '',
    },
  });

  useEffect(() => {
    if (result?.logos && result.logos.length > 0) {
      const dataUris = result.logos.map(logo => `data:image/svg+xml;base64,${window.btoa(logo.logoSvg)}`);
      setLogoDataUris(dataUris);
    } else {
      setLogoDataUris([]);
    }
  }, [result]);

  async function onSubmit(values: LogoDesignInput) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await generateLogo(values);
      if (!output.logos || output.logos.length === 0) {
        throw new Error('Logo generation failed to return any images.');
      }
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate logos. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Logo Creator</CardTitle>
          <CardDescription>
            Bring your brand to life. Describe your business and desired aesthetic, and our AI will generate a selection of unique logos for you to choose from.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Innovate Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Technology, Retail" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="aestheticPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aesthetic Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Minimalist, modern, with a blue and silver color scheme. I like geometric shapes."
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
                Generate Logos
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center rounded-lg border p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-4 text-muted-foreground">Generating your logos...</p>
        </div>
      )}

      {result && result.logos && result.logos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Your AI-Generated Logos</CardTitle>
            <CardDescription>
              Here are your AI-generated logos. Review the options and download your favorite as a scalable SVG file.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.logos.map((logo, index) => (
              <Card key={index} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col items-center gap-4 p-6">
                  <div className="relative h-40 w-40 rounded-lg bg-muted p-2">
                    {logoDataUris[index] && (
                      <Image
                        src={logoDataUris[index]}
                        alt={`Generated logo ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {logo.description}
                  </p>
                </CardContent>
                <CardFooter className="justify-center pt-0">
                  <Button asChild variant="outline" size="sm">
                    <a href={logoDataUris[index]} download={`${form.getValues('businessName').replace(/\s+/g, '-').toLowerCase()}-logo-${index + 1}.svg`}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
