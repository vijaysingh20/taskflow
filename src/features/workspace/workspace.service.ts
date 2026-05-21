import { AppError } from '@/shared/errors/AppError';
import { workspaceRepository } from './workspace.repository';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './workspace.schema';

export const createWorkspace = async (userId: string, data: CreateWorkspaceDto) => {
  const workspace = await workspaceRepository.createWorkspaceWithOwner({
    name: data.name,
    ownerUserId: userId,
  });
  return workspace;
};

export const getWorkspaces = async (userId: string) => {
  const workspaces = await workspaceRepository.findByUserId(userId);
  return workspaces;
};

export const getWorkspaceById = async (userId: string, workspaceId: string) => {
  const workspace = await workspaceRepository.findById(workspaceId);
  if (!workspace) {
    throw new AppError('Workspace not found', 404);
  }

  const membership = await workspaceRepository.findMembership(workspaceId, userId);
  if (!membership) {
    throw new AppError('Unauthorized to access this workspace', 403);
  }
  return workspace;
};

export const updateWorkspace = async (
  userId: string,
  workSpaceId: string,
  data: UpdateWorkspaceDto
) => {
  const workspace = await workspaceRepository.findById(workSpaceId);
  if (!workspace) {
    throw new AppError('Workspace not found', 404);
  }

  if (workspace.ownerUserId !== userId) {
    throw new AppError('Unauthorized to update this workspace', 403);
  }

  const updated = await workspaceRepository.update(workSpaceId, {
    name: data.name,
  });
  return updated;
};

export const deleteWorkspace = async (userId: string, workspaceId: string) => {
  const workspace = await workspaceRepository.findById(workspaceId);
  if (!workspace) {
    throw new AppError('Workspace not found', 404);
  }

  if (workspace.ownerUserId !== userId) {
    throw new AppError('Unauthorized to delete this workspace', 403);
  }

  await workspaceRepository.deleteWorkspace(workspaceId);
  return { message: 'Workspace deleted successfully' };
};
