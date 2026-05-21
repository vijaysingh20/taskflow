import { prisma } from '@/shared/utils/prisma';

export class UserRepository {
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: { name: string; email: string; passwordHash: string }) {
    return await prisma.user.create({ data });
  }

  async createRefreshToken(data: { userId: string; token: string; expiresAt: Date }) {
    return await prisma.refreshToken.create({ data });
  }

  async findRefreshToken(token: string) {
    return await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteRefreshToken(id: string) {
    return await prisma.refreshToken.delete({
      where: { id },
    });
  }

  async deleteRefreshTokenByValue(token: string) {
    return await prisma.refreshToken.delete({
      where: { token },
    });
  }
}

export const userRepository = new UserRepository();
