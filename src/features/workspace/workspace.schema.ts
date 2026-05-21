import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceSchema>;
