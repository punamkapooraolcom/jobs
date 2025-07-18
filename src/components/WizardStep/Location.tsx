// src/components/WizardStep/Location.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LocationStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Location</h2>
      <p>Enter your city</p>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" placeholder="e.g., San Francisco" />
      </div>
      <Button variant="secondary" className="w-full">Use my current location</Button>
    </div>
  );
}
