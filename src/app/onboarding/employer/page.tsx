'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { createJobOpening, getSkills } from '@/actions/userActions';

const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  skill: z.string({ required_error: 'Please select a skill.' }),
  jobDescription: z.string().min(10, 'Description must be at least 10 characters.'),
});

type Skill = {
  id: string;
  name: string;
};

export default function EmployerOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoadingSkills(true);
      try {
        const skillsData = await getSkills();
        if (skillsData.length > 0) {
          setSkills(skillsData);
        } else {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Could not load skills from the database. Please try again later.',
            });
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
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
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      jobDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Not Authenticated',
            description: 'You must be logged in to create a job opening.',
        });
        return;
    }

    setIsSubmitting(true);
    try {
        const result = await createJobOpening(user.uid, user.phoneNumber, values);
        if (result.success) {
            toast({
                title: 'Job Opening Created!',
                description: 'Your new job opening is now live.',
            });
            router.push('/matches');
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem creating your job opening. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create a New Job Opening</CardTitle>
          <CardDescription>Post a new job to find the perfect candidate.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tech Solutions Inc." {...field} />
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
                    <FormLabel>Looking for</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingSkills || isSubmitting}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingSkills ? "Loading skills..." : "Select the skill you are hiring for"} />
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
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the ideal candidate, required skills, and job roles..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting || !user}>
                {isSubmitting ? 'Posting Job...' : 'Post Job & Find Talent'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
