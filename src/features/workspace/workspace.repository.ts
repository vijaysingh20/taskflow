import { prisma } from '@/shared/utils/prisma';

export class WorkspaceRepository {
  async create(data: { name: string; ownerUserId: string }) {
    return await prisma.workspace.create({ data });
  }

  async findById(id: string) {
    return await prisma.workspace.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string) {
    return await prisma.workspace.findMany({
      where: {
        OR: [{ ownerUserId: userId }, { members: { some: { userId } } }],
      },
    });
  }

  async update(id: string, data: { name?: string }) {
    return await prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async deleteWorkspace(id: string) {
    return await prisma.workspace.delete({
      where: { id },
    });
  }

  async createWorkspaceWithOwner(data: { name: string; ownerUserId: string }) {
    return await prisma.$transaction(async (prisma) => {
      const workspace = await prisma.workspace.create({ data });
      await prisma.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: data.ownerUserId,
          role: 'OWNER',
        },
      });
      return workspace;
    });
  }

  async findMembership(workspaceId: string, userId: string) {
    return await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
    });
  }
}

export const workspaceRepository = new WorkspaceRepository();
