'use client';

import Link from 'next/link';
import { Bell, Grip } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from './badge';

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Grip className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">SwipeMatch</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Badge variant="destructive" className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full p-0 text-xs">
              3
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
