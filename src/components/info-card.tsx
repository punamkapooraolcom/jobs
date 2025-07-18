// src/components/info-card.tsx
import Image from 'next/image';
import { Card } from './ui/card';
import { Briefcase, User, Phone, MessageSquare, BadgeCheck } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';


type InfoCardItem = {
  id: string;
  name: string;
  title: string;
  image: string;
  dataAiHint: string;
  type: 'worker' | 'job';
  isMatch: boolean;
};

type InfoCardProps = {
  item: InfoCardItem;
  onChat: () => void;
  onCall: () => void;
};


export function InfoCard({ item, onChat, onCall }: InfoCardProps) {
  return (
    <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <Image
          src={item.image}
          alt={item.name}
          data-ai-hint={item.dataAiHint}
          width={64}
          height={64}
          className="rounded-full object-cover w-16 h-16 border"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-lg">{item.name}</p>
            {item.isMatch && <BadgeCheck className="h-5 w-5 text-green-500" />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.title}</p>
        </div>
        <div className={cn(
          "flex items-center justify-center h-10 w-10 rounded-full",
          item.type === 'job' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
        )}>
          {item.type === 'job' ? <Briefcase className="h-5 w-5" /> : <User className="h-5 w-5" />}
        </div>
      </div>
      
      {item.isMatch && (
        <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
          <Button variant="outline" size="sm" className="flex-1" onClick={onChat}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={onCall}>
            <Phone className="mr-2 h-4 w-4" />
            Call
          </Button>
        </div>
      )}
    </Card>
  );
}
