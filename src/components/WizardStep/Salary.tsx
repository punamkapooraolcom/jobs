// src/components/WizardStep/Salary.tsx
'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SalaryStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Salary</h2>
      <p>What is your desired or offered salary?</p>
      <div>
        <Label htmlFor="salary">Salary ($)</Label>
        <Input id="salary" type="number" placeholder="e.g., 25" />
      </div>
    </div>
  );
}
