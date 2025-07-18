// src/components/WizardStep/Phone.tsx
'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function PhoneStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Phone</h2>
      <p>Confirm your phone number.</p>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" readOnly value="+1 555-123-4567" />
      </div>
    </div>
  );
}
