import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl">I am a...</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link href="/onboarding/worker" passHref>
            <Button variant="outline" className="h-auto w-full p-6 flex flex-col space-y-2">
              <User className="h-10 w-10 mb-2" />
              <span className="font-semibold text-lg">Worker</span>
            </Button>
          </Link>
          <Link href="/onboarding/employer" passHref>
            <Button variant="outline" className="h-auto w-full p-6 flex flex-col space-y-2">
               <Building className="h-10 w-10 mb-2" />
              <span className="font-semibold text-lg">Employer</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
