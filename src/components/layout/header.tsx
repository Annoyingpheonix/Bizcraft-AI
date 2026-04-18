"use client";

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';

const pages: Record<string, string> = {
  '/': 'Dashboard',
  '/ad-generator': 'Ad Generator',
  '/infographic-designer': 'Infographic Designer',
  '/logo-creator': 'Logo Creator',
  '/chart-generator': 'Chart Generator',
  '/whitepaper-outliner': 'Whitepaper Outliner',
  '/social-media-post-generator': 'Social Media Post Generator',
  '/ebook-generator': 'E-book Outliner',
};

export function Header() {
  const pathname = usePathname();
  const pageTitle = pages[pathname] || 'BizCraft AI';

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-8">
      <SidebarTrigger className="md:hidden" />
      <h1 className="font-headline text-xl font-semibold tracking-tight md:text-2xl">
        {pageTitle}
      </h1>
    </header>
  );
}
