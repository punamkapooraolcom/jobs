// src/components/Wizard.tsx
'use client';
import { Button } from './ui/button';

export default function Wizard({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex-1 p-4">{children}</div>
      <div className="flex justify-between p-4 border-t">
        <Button variant="outline">◀️ Previous</Button>
        <Button>▶️ Next</Button>
      </div>
    </div>
  );
}
