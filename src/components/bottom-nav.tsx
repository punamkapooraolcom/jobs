
'use client';

import { Heart, User, Briefcase, CheckCircle, LogOut, Store, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './ui/button';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
// import { notificationService } from '@/services/notificationService';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [acceptsCount, setAcceptsCount] = useState(0);

  // useEffect(() => {
  //   if (user?.uid) {
  //     const unsubscribe = notificationService.listenForUnreadCount(user.uid, (count) => {
  //       setAcceptsCount(count);
  //     });
  //     // Cleanup the listener when the component unmounts
  //     return () => unsubscribe();
  //   }
  // }, [user]);

  const navItems = [
    { href: '/accepts', icon: CheckCircle, label: 'Incoming', badgeCount: acceptsCount },
    { href: '/favorites', icon: Heart, label: 'I Liked', badgeCount: 0 },
    { href: '/match', icon: HeartHandshake, label: 'Match', badgeCount: 0 },
    { href: '/matches', icon: Store, label: 'Market', badgeCount: 0 },
    { href: '/profile', icon: User, label: 'Profile', badgeCount: 0 },
  ];

  const handleSignOut = async () => {
    await authService.signOut();
    router.push('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-primary/10 flex justify-around h-16 items-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.label} className="flex-1">
            <div
              className={cn(
                'flex flex-col items-center justify-center gap-1 h-full relative border-t-2 pt-1',
                isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
              )}
            >
              {item.badgeCount > 0 && (
                <Badge variant="destructive" className="absolute top-0 right-1/2 translate-x-[200%] -translate-y-[2px] px-1.5 py-0.5 text-xs">
                  {item.badgeCount}
                </Badge>
              )}
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          </Link>
        );
      })}
       <div className="flex-1">
         <div
            className='flex flex-col items-center justify-center gap-1 h-full relative border-t-2 pt-1 border-transparent text-muted-foreground'
          >
            <Button variant="ghost" size="icon" className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground" onClick={handleSignOut}>
                <LogOut className="w-6 h-6" />
                <span className="text-xs font-medium">Logout</span>
            </Button>
        </div>
       </div>
    </nav>
  );
}
