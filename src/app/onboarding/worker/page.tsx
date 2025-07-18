
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { createWorkerProfile, getSkills } from '@/actions/userActions';

const workerFormSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  skill: z.string({
    required_error: 'Please select a skill.',
  }),
  availability: z.enum(['full-time', 'part-time', 'contract'], {
    required_error: 'You need to select an availability.',
  }),
});

type WorkerFormData = z.infer<typeof workerFormSchema>;

type Skill = {
  id: string;
  name: string;
};

export default function WorkerOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoadingSkills(true);
      try {
        const skillsData = await getSkills();
        setSkills(skillsData);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load skills from the database.',
        });
      } finally {
        setIsLoadingSkills(false);
      }
    };
    fetchSkills();
  }, [toast]);

  const form = useForm<WorkerFormData>({
    resolver: zodResolver(workerFormSchema),
    defaultValues: {
      fullName: '',
      skill: '',
      availability: undefined,
    },
  });

  async function onSubmit(data: WorkerFormData) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to create a profile.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await createWorkerProfile(user.uid, user.phoneNumber, data);

      if (result.success) {
        toast({
          title: 'Profile Created!',
          description: 'Your worker profile has been saved.',
        });
        router.push('/matches');
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          'There was a problem creating your profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create Your Worker Profile</CardTitle>
          <CardDescription>
            Tell us about your skills and availability to get matched with jobs.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Skill</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingSkills}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingSkills ? "Loading skills..." : "Select your primary skill"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!isLoadingSkills && skills.map(skill => (
                          <SelectItem key={skill.id} value={skill.name}>{skill.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full-Time</SelectItem>
                        <SelectItem value="part-time">Part-Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading || isLoadingSkills}>
                {isLoading ? 'Saving Profile...' : 'Create Profile & Find Matches'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
