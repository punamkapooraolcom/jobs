// src/components/WizardStep/NamePhoto.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function NamePhotoStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Name & Picture</h2>
      <p>Enter your full name and take a picture.</p>
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="e.g., Jane Doe" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-40 h-40 bg-muted rounded-full overflow-hidden flex items-center justify-center">
            <Image src="https://placehold.co/160x160" alt="placeholder" width={160} height={160} data-ai-hint="placeholder image"/>
        </div>
        <Button variant="secondary">Take picture</Button>
      </div>
    </div>
  );
}
