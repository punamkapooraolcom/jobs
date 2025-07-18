
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserRoles } from '@/actions/userActions';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (!loading) {
        if (user) {
          // User is logged in, check if they have a profile.
          const roles = await getUserRoles(user.uid);
          if (roles.isWorker || roles.isEmployer) {
            // Existing user, redirect to the main matches/swiping page.
            router.push('/matches');
          } else {
            // New user, redirect to onboarding.
            router.push('/onboarding');
          }
        } else {
          // User is not logged in, redirect to the login page.
          router.push('/login');
        }
      }
    };
    checkUserAndRedirect();
  }, [user, loading, router]);

  // Display a loading indicator while checking auth state and roles.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
