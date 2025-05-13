import { z } from 'zod';

export const addParticipantBodySchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  phone_number: z.string().refine((val) => /^\+?[1-9]\d{1,14}$/.test(val), {
    message: 'Invalid E.164 phone number format',
  }),
});

export const addParticipantPathSchema = z.object({
  conversationId: z.string().uuid(),
});
