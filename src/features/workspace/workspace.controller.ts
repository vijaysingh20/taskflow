import { RequestHandler } from 'express';
import { createWorkspaceSchema, updateWorkspaceSchema } from './workspace.schema';
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaceById,
  getWorkspaces,
  updateWorkspace,
} from './workspace.service';

type WorkspaceParams = { workspaceId: string };

export const create: RequestHandler = async (req, res, next) => {
  try {
    const parsed = createWorkspaceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const workspace = await createWorkspace(req.user.userId, parsed.data);
    res.status(201).json({ status: 'success', data: workspace });
  } catch (err) {
    next(err);
  }
};

export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const workspaces = await getWorkspaces(req.user.userId);
    res.status(200).json({ status: 'success', data: workspaces });
  } catch (err) {
    next(err);
  }
};

export const getOne: RequestHandler<WorkspaceParams> = async (req, res, next) => {
  try {
    const workspace = await getWorkspaceById(req.user.userId, req.params.workspaceId);
    res.status(200).json({ status: 'success', data: workspace });
  } catch (err) {
    next(err);
  }
};

export const update: RequestHandler<WorkspaceParams> = async (req, res, next) => {
  try {
    const parsed = updateWorkspaceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const workspace = await updateWorkspace(req.user.userId, req.params.workspaceId, parsed.data);
    res.status(200).json({ status: 'success', data: workspace });
  } catch (err) {
    next(err);
  }
};

export const remove: RequestHandler<WorkspaceParams> = async (req, res, next) => {
  try {
    const result = await deleteWorkspace(req.user.userId, req.params.workspaceId);
    res.status(200).json({ status: 'success', data: result });
  } catch (err) {
    next(err);
  }
};
