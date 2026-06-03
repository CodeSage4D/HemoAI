import { prisma } from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/encryption';
import { generateAccessToken, generateRefreshToken, TokenPayload } from '../../utils/jwt';
import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

export class AuthService {
  async register(email: string, password: string, fullName: string, role: Role) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const err: any = new Error('Email already registered');
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      const err: any = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      const err: any = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as {
        sub: string;
        email: string;
        role: Role;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || !user.isActive) {
        const err: any = new Error('User session expired or deactivated');
        err.statusCode = 401;
        throw err;
      }

      const payload: TokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      const error: any = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }
  }
}
export default AuthService;
