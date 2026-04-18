"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  Book,
  FileText,
  Gem,
  LayoutDashboard,
  LayoutTemplate,
  Megaphone,
  Paintbrush,
  Share2,
} from 'lucide-react';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/logo-creator', label: 'Logo Creator', icon: Paintbrush },
  { href: '/ad-generator', label: 'Ad Generator', icon: Megaphone },
  {
    href: '/social-media-post-generator',
    label: 'Social Media Post',
    icon: Share2,
  },
  {
    href: '/infographic-designer',
    label: 'Infographic Designer',
    icon: LayoutTemplate,
  },
  { href: '/chart-generator', label: 'Chart Generator', icon: BarChart3 },
  {
    href: '/whitepaper-outliner',
    label: 'Whitepaper Outliner',
    icon: FileText,
  },
  {
    href: '/ebook-generator',
    label: 'E-book Outliner',
    icon: Book,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Gem className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg font-semibold">BizCraft AI</span>
        </Link>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {links.map((link) => (
          <SidebarMenuItem key={link.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === link.href}
              tooltip={link.label}
            >
              <Link href={link.href}>
                <link.icon />
                <span>{link.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
