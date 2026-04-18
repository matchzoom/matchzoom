import { z } from 'zod';

export const CreateProfileBodySchema = z.object({
  name: z.string().min(1),
  gender: z.string().min(1),
  education: z.string().min(1),
  region_primary: z.string().min(1),
  region_secondary: z.string().optional(),
  is_barrier_free: z.boolean(),
  disability_type: z.array(z.string()).min(1),
  disability_level: z.string().min(1),
  mobility: z.string().min(1),
  hand_usage: z.string().min(1),
  stamina: z.string().min(1),
  communication: z.string().min(1),
  instruction_level: z.string().min(1),
  hope_activities: z.array(z.string()).min(1),
});

export type CreateProfileBody = z.infer<typeof CreateProfileBodySchema>;

export type Profile = {
  id: number;
  user_id: number;
  name: string;
  gender: string;
  education: string;
  region_primary: string;
  region_secondary: string | null;
  is_barrier_free: boolean;
  disability_type: string[];
  disability_level: string;
  mobility: string;
  hand_usage: string;
  stamina: string;
  communication: string;
  instruction_level: string;
  hope_activities: string[];
  created_at: string;
  updated_at: string;
};
