import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Megaphone,
  LayoutTemplate,
  Paintbrush,
  BarChart3,
  FileText,
  ArrowRight,
  Share2,
  Book,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

const mainFeature = {
  title: 'Logo Creator',
  description:
    'Describe your vision and let AI design a unique logo for your brand.',
  href: '/logo-creator',
  icon: Paintbrush,
  image: 'dashboard-logo',
};

const otherFeatures = [
  {
    title: 'Ad Generator',
    description: 'Create compelling ad copy for various platforms.',
    href: '/ad-generator',
    icon: Megaphone,
    image: 'dashboard-ad-generator',
  },
  {
    title: 'Social Media Post',
    description: 'Generate engaging posts for your social channels.',
    href: '/social-media-post-generator',
    icon: Share2,
    image: 'dashboard-social-media',
  },
  {
    title: 'Infographic Designer',
    description: 'Summarize text and get ideas for infographics.',
    href: '/infographic-designer',
    icon: LayoutTemplate,
    image: 'dashboard-infographic',
  },
  {
    title: 'Chart Generator',
    description: 'Visualize your data with various charts.',
    href: '/chart-generator',
    icon: BarChart3,
    image: 'dashboard-chart',
  },
  {
    title: 'Whitepaper Outliner',
    description: 'Get structured outlines and keywords for whitepapers.',
    href: '/whitepaper-outliner',
    icon: FileText,
    image: 'dashboard-whitepaper',
  },
  {
    title: 'E-book Outliner',
    description: 'Generate a structured outline for your next e-book.',
    href: '/ebook-generator',
    icon: Book,
    image: 'dashboard-ebook',
  },
];

export default function DashboardPage() {
  const mainFeaturePlaceholder = PlaceHolderImages.find(
    (p) => p.id === mainFeature.image
  );
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
          Welcome to BizCraft AI
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your all-in-one AI toolkit for creating professional business
          resources.
        </p>
      </div>

      <Link href={mainFeature.href} className="group block">
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="grid items-center md:grid-cols-5">
            <div className="p-6 md:col-span-2 md:p-8">
              <mainFeature.icon className="h-10 w-10 text-primary mb-4" />
              <h2 className="font-headline text-3xl font-bold group-hover:text-primary">
                {mainFeature.title}
              </h2>
              <p className="mt-2 text-base text-muted-foreground">
                {mainFeature.description}
              </p>
              <div className="mt-6">
                <Button>
                  <span>Create a Logo</span>
                  <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
            <div className="relative order-first h-64 min-h-[250px] md:order-last md:col-span-3 md:h-full">
              <Image
                src={
                  mainFeaturePlaceholder?.imageUrl ||
                  `https://picsum.photos/seed/${mainFeature.title}/800/600`
                }
                alt={mainFeature.title}
                fill
                className="object-cover"
                data-ai-hint={mainFeaturePlaceholder?.imageHint || 'abstract'}
              />
            </div>
          </div>
        </Card>
      </Link>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline">
          More Tools
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherFeatures.map((feature) => {
            const placeholder = PlaceHolderImages.find(
              (p) => p.id === feature.image
            );
            return (
              <Link href={feature.href} key={feature.title} className="group">
                <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative h-40 w-full">
                      <Image
                        src={
                          placeholder?.imageUrl ||
                          `https://picsum.photos/seed/${feature.title}/600/400`
                        }
                        alt={feature.title}
                        fill
                        className="object-cover"
                        data-ai-hint={placeholder?.imageHint || 'abstract'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                  <CardHeader className="flex-1">
                    <CardTitle className="font-headline text-lg group-hover:text-primary">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
