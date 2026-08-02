import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import {
  listNotifications,
  readAllNotifications,
  readNotification,
} from './notification.controller';
import {
  validateNotificationList,
  validateNotificationParams,
} from './notification.schema';

const notificationRoutes = Router();

notificationRoutes.use(authenticate);
notificationRoutes.get('/', validateNotificationList, listNotifications);
notificationRoutes.patch('/read-all', readAllNotifications);
notificationRoutes.patch('/:notificationId/read', validateNotificationParams, readNotification);

export default notificationRoutes;
