import { Router } from 'express';
import { authenticate } from '@/shared/middleware/authenticate';
import { create, getAll, getOne, remove, update } from './workspace.controller';

const workspaceRouter = Router();

workspaceRouter.use(authenticate);

workspaceRouter.post('/', create);
workspaceRouter.get('/', getAll);
workspaceRouter.get('/:workspaceId', getOne);
workspaceRouter.patch('/:workspaceId', update);
workspaceRouter.delete('/:workspaceId', remove);

export default workspaceRouter;
