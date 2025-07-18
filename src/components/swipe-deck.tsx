
'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import SwipeCard from './swipe-card';
import { Button } from './ui/button';
import { X, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { recordSwipe } from '@/actions/swipeActions';
import { getSwipeableProfiles } from '@/actions/userActions';
import type { Profile } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

type SwipeDeckProps = {
  activeRole: 'worker' | 'employer';
};

export default function SwipeDeck({ activeRole }: SwipeDeckProps) {
  const swiperRef = useRef<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      const fetchProfiles = async () => {
        setIsLoading(true);
        const swipeableProfiles = await getSwipeableProfiles(user.uid, activeRole);
        setProfiles(swipeableProfiles);
        setIsLoading(false);
      };
      fetchProfiles();
    }
  }, [user, activeRole]);

  const handleSwipeAction = async (direction: 'left' | 'right') => {
    if (!swiperRef.current?.swiper || !user) return;
    
    const activeIndex = swiperRef.current.swiper.activeIndex;
    const swipedProfile = profiles[activeIndex];

    if (!swipedProfile) return;

    // Optimistically remove the card from the UI
    const remainingProfiles = profiles.filter((p) => p.id !== swipedProfile.id);
    
    // Go to the next slide if there are any profiles left
    if (remainingProfiles.length > 0 && activeIndex < profiles.length -1) {
       swiperRef.current.swiper.slideNext();
    }
    
    setProfiles(remainingProfiles);
    
    // Record the swipe in the database
    const result = await recordSwipe(user.uid, swipedProfile.id, swipedProfile.ownerUid, direction);

    if (direction === 'right') {
      if (result.match) {
        toast({
          title: "It's a Match!",
          description: `You and ${swipedProfile.name} are now connected.`,
        });
      } else {
        toast({
          title: 'Interest shown!',
          description: "We've added this to your favorites.",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-4 gap-4">
        <Skeleton className="w-full h-[65vh] max-w-sm mx-auto rounded-2xl" />
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4 relative">
        {profiles.length > 0 ? (
          <>
            <div className="w-full h-[65vh] max-w-sm mx-auto">
              <Swiper
                ref={swiperRef}
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                className="h-full w-full"
                allowTouchMove={false} 
              >
                {profiles.map((profile) => (
                  <SwiperSlide key={profile.id} className="h-full w-full">
                    <SwipeCard profile={profile} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="flex items-center justify-center gap-8">
              <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-4 border-destructive text-destructive hover:bg-destructive/10" onClick={() => handleSwipeAction('left')}>
                  <X className="h-8 w-8" />
              </Button>
              <Button variant="outline" size="icon" className="h-20 w-20 rounded-full border-4 border-primary text-primary hover:bg-primary/10" onClick={() => handleSwipeAction('right')}>
                  <Heart className="h-10 w-10" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground pt-10">
            <h3 className="text-xl font-semibold">No more profiles</h3>
            <p>You've seen everyone for now. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}
