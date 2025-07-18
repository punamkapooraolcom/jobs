// src/components/AuthPhoneForm.tsx
'use client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function AuthPhoneForm() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" placeholder="+1 555-555-5555" />
      </div>
      <Button className="w-full">Send Code</Button>
    </div>
  );
}
