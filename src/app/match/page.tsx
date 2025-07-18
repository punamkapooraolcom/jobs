
'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/bottom-nav';
import Header from '@/components/header';
import { useAuth } from '@/hooks/useAuth';
import { getMatches } from '@/actions/userActions';
import { Skeleton } from '@/components/ui/skeleton';
import { InfoCard } from '@/components/info-card';
import { useToast } from '@/hooks/use-toast';

type MatchedItem = {
  id: string;
  name: string;
  title: string;
  image: string;
  dataAiHint: string;
  type: 'worker' | 'job';
  isMatch: boolean;
};

export default function MatchPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<MatchedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      setIsLoading(true);
      getMatches(user.uid)
        .then(setMatches)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const handleChat = (name: string) => {
    toast({
      title: 'Chat not implemented',
      description: `You will be able to chat with ${name} soon!`,
    });
  };

  const handleCall = (name: string) => {
    toast({
      title: 'Calling not implemented',
      description: `You will be able to call ${name} soon!`,
    });
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <main className="flex-1 overflow-y-auto pt-14 pb-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-primary">Mutual Matches</h1>
          <p className="text-muted-foreground">
            You've both shown interest! Now make a connection.
          </p>
          <div className="mt-6 space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </>
            ) : matches.length > 0 ? (
              matches.map((item) => (
                <InfoCard
                  key={item.id}
                  item={item}
                  onChat={() => handleChat(item.name)}
                  onCall={() => handleCall(item.name)}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground pt-8">
                No matches yet. Keep swiping in the Market!
              </p>
            )}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
