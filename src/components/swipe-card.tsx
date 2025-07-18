// src/components/SwipeCard.tsx
import Image from 'next/image';
import { Badge } from './ui/badge';
import type { Profile } from '@/lib/types';
import { Briefcase, MapPin, DollarSign } from 'lucide-react';

export default function SwipeCard({ profile }: { profile: Profile }) {
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-lg bg-card">
      <Image
        src={profile.image}
        alt={profile.name}
        data-ai-hint={profile.dataAiHint}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      <div className="absolute top-4 right-4 z-10">
        <Badge variant="secondary" className="text-primary uppercase text-xs font-bold tracking-wider">
           {profile.title}
        </Badge>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
        <h3 className="text-3xl font-bold">{profile.name}</h3>
        <div className="flex flex-col gap-2 mt-2 text-sm">
            <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-white/80" />
                <span>2.4 km away</span>
            </div>
             <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-white/80" />
                <span>$25/hr</span>
            </div>
             <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-white/80" />
                <span>{profile.skills.join(', ')}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
