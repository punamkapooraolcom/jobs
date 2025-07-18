// src/components/WizardStep/Skill.tsx
'use client';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const skills = ["Cook", "Delivery Driver", "Driver Car", "Sales Manager", "Sales Person"];

export default function SkillStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Skill</h2>
      <p>Select your primary skill or the role you are hiring for.</p>
      <div>
        <Label htmlFor="skill">Skill</Label>
        <Select>
            <SelectTrigger>
                <SelectValue placeholder="Select a skill..." />
            </SelectTrigger>
            <SelectContent>
                {skills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
    </div>
  );
}
