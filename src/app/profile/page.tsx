
'use client';

import { useEffect, useState } from 'react';
import BottomNav from '@/components/bottom-nav';
import Header from '@/components/header';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/actions/userActions';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, User as UserIcon, Briefcase, Edit, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type UserProfileData = {
  name: string | null;
  phoneNumber: string | null;
  workerProfiles: Record<string, any>[];
  employerJobs: Record<string, any>[];
};

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      setIsLoading(true);
      getUserProfile(user.uid)
        .then(setProfile)
        .finally(() => setIsLoading(false));
    }
  }, [user]);
  
  const handleEdit = () => {
    toast({
      title: 'Editing not implemented',
      description: 'You will be able to edit your profiles soon!',
    });
  };

  const ProfileSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  );
  
  const hasContent = profile && (profile.workerProfiles.length > 0 || profile.employerJobs.length > 0);

  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <main className="flex-1 overflow-y-auto pt-20 pb-20 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">{profile?.name || 'My Profile'}</h1>
              <p className="text-muted-foreground">Manage your profiles and activity.</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEdit} variant="outline"><Edit className="mr-2 h-4 w-4"/> Edit</Button>
            </div>
          </div>

          <Card className="mb-8">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-6 w-6 text-primary" />
                  <span>Add a New Role</span>
                </CardTitle>
                <CardDescription>You can be both a worker and an employer. Add a new profile or job posting at any time.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                <Link href="/onboarding/worker" className="w-full">
                    <Button className="w-full" variant="outline">
                        <UserIcon className="mr-2 h-4 w-4"/> Seek New Job
                    </Button>
                </Link>
                <Link href="/onboarding/employer" className="w-full">
                    <Button className="w-full" variant="outline">
                        <Building className="mr-2 h-4 w-4"/> Post a New Job
                    </Button>
                </Link>
              </CardContent>
          </Card>


          {isLoading ? (
            <ProfileSkeleton />
          ) : (
            <div className="space-y-8">
              {profile?.workerProfiles && profile.workerProfiles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-6 w-6 text-primary" />
                      <span>My Worker Profiles</span>
                    </CardTitle>
                    <CardDescription>This is how employers see you.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     {profile.workerProfiles.map((workerProfile) => (
                      <div key={workerProfile.id} className="p-4 border rounded-lg">
                          <div className="font-bold text-xl">{workerProfile.fullName}</div>
                          <div className="flex items-center gap-2 text-muted-foreground mt-2">
                            <Briefcase className="h-5 w-5" />
                            <span>{workerProfile.skill}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <span className="capitalize bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                              {workerProfile.availability}
                            </span>
                          </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {profile?.employerJobs && profile.employerJobs.length > 0 && (
                <Card>
                   <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-6 w-6 text-primary" />
                      <span>My Job Postings</span>
                    </CardTitle>
                    <CardDescription>Your active job postings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profile.employerJobs.map((job) => (
                      <div key={job.id} className="p-4 border rounded-lg">
                        <p className="font-bold">{job.companyName}</p>
                        <p className="text-sm text-primary font-semibold">{job.skill}</p>
                        <p className="text-muted-foreground mt-1">{job.jobDescription}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {!hasContent && !isLoading && (
                 <p className="text-center text-muted-foreground pt-8">
                    You haven't created any profiles or jobs yet. Go to onboarding to get started.
                  </p>
              )}
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
