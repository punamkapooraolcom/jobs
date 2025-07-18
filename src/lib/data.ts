import type { Profile } from './types';

export const profiles: Profile[] = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    type: 'worker',
    title: 'Senior Frontend Developer',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    image: 'https://placehold.co/600x800',
    dataAiHint: 'woman smiling',
  },
  {
    id: 2,
    name: 'Ben Carter',
    type: 'worker',
    title: 'UX/UI Designer',
    skills: ['Figma', 'Adobe XD', 'User Research'],
    image: 'https://placehold.co/600x800',
    dataAiHint: 'man portrait',
  },
  {
    id: 3,
    name: 'Aisha Khan',
    type: 'worker',
    title: 'Full-Stack Engineer',
    skills: ['Node.js', 'Python', 'Docker', 'AWS'],
    image: 'https://placehold.co/600x800',
    dataAiHint: 'woman programmer',
  },
];

export function getProfiles(): Profile[] {
  return profiles;
}

export const skills = ["Cook", "Delivery Driver", "Driver Car", "Sales Manager", "Sales Person"];
