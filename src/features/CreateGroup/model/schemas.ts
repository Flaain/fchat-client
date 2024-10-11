import { z } from 'zod';
import { loginForSchema, nameForSchema } from '@/shared/constants';

export const createGroupSchema = z.object({
    username: z.string().optional(),
    name: nameForSchema,
    login: loginForSchema
});