import { z } from 'zod';

export const paginationSchema = z.object({
  limit: z.number().int().min(1).optional(),
  offset: z.number().int().min(1).optional(),
});

// similary we can add common sort, filter and other validations here
