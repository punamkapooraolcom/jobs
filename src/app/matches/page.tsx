'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BottomNav from '@/components/bottom-nav';
import Header from '@/components/header';
import SwipeDeck from '@/components/swipe-deck';
import { useAuth } from '@/hooks/useAuth';
import { getUserRoles } from '@/actions/userActions';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

type ActiveRole = 'worker' | 'employer';

export default function MatchesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [roles, setRoles] = useState<{ isWorker: boolean; isEmployer: boolean }>({ isWorker: false, isEmployer: false });
  const [activeRole, setActiveRole] = useState<ActiveRole>('worker');
  const [isRolesLoading, setIsRolesLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setIsRolesLoading(true);
      getUserRoles(user.uid).then(userRoles => {
        setRoles(userRoles);
        // Set a smart default active role
        if (userRoles.isWorker) {
          setActiveRole('worker');
        } else if (userRoles.isEmployer) {
          setActiveRole('employer');
        }
        setIsRolesLoading(false);
      });
    }
  }, [user, loading, router]);

  if (loading || isRolesLoading) {
    return (
      <div className="flex h-screen w-full flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto pt-14 pb-16">
          <div className="flex h-full w-full flex-col items-center justify-center p-4 gap-4">
            <Skeleton className="w-full h-[65vh] max-w-sm mx-auto rounded-2xl" />
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-20 w-20 rounded-full" />
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const showTabs = roles.isWorker && roles.isEmployer;

  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <main className="flex-1 overflow-y-auto pt-14 pb-16">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-primary/10 sticky top-14 z-10">
          <div className="container mx-auto px-4 py-4">
            {showTabs ? (
              <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as ActiveRole)} className="w-full flex justify-center">
                <TabsList>
                  <TabsTrigger value="worker">Find Jobs</TabsTrigger>
                  <TabsTrigger value="employer">Find Talent</TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
               <h1 className="text-2xl font-bold text-primary text-center">
                {roles.isWorker ? 'Find Jobs' : 'Find Talent'}
              </h1>
            )}
          </div>
        </div>
        <SwipeDeck activeRole={activeRole} key={activeRole} />
      </main>
      <BottomNav />
    </div>
  );
}
