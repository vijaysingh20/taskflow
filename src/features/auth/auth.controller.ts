import { RequestHandler } from 'express';
import { loginUser, logoutUser, refreshToken, registerUser } from './auth.service';
import { loginSchema, refreshSchema, registerSchema } from './auth.schema';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const resp = await registerUser(parsed.data);
    res.status(201).json({
      status: 'success',
      data: resp,
    });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const resp = await loginUser(parsed.data);
    res.status(200).json({
      status: 'success',
      data: resp,
    });
  } catch (err) {
    next(err);
  }
};

export const tokenRefresh: RequestHandler = async (req, res, next) => {
  try {
    const parsed = refreshSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const resp = await refreshToken(parsed.data);
    res.status(200).json({
      status: 'success',
      data: resp,
    });
  } catch (err) {
    next(err);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (typeof refreshToken !== 'string' || refreshToken.trim() === '') {
      res.status(400).json({ error: 'Refresh token is required' });
      return;
    }
    await logoutUser(refreshToken);
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
};
