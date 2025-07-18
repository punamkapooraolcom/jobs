// src/components/RoleSelect.tsx
'use client';
import { Button } from './ui/button';

export default function RoleSelect() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-8">How would you like to continue?</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            <Button variant="outline" className="h-32 text-lg">
                👷 Continue as Worker
            </Button>
            <Button variant="outline" className="h-32 text-lg">
                🏢 Continue as Employer
            </Button>
        </div>
    </div>
  );
}
