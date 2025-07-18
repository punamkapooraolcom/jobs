export type Profile = {
  id: string; // The ID of the worker profile or job document
  ownerUid: string; // The UID of the user who owns the profile/job
  name: string;
  type: 'worker' | 'job';
  title: string;
  skills: string[];
  image: string;
  dataAiHint: string;
};
