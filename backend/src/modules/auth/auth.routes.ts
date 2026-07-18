import { Router } from 'express';

import {
  changePasswordController,
  login,
  me,
  registerVisitorController,
} from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register-visitor', registerVisitorController);
authRouter.get('/me', authenticate, me);
authRouter.patch('/change-password', authenticate, changePasswordController);

export default authRouter;
