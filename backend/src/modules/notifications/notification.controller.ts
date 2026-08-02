import { Request, Response } from 'express';

import {
  listUserNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from './notification.service';

const requireUser = (req: Request, res: Response): string | null => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return null;
  }
  return req.user.id;
};

export const listNotifications = async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  const { page, limit } = res.locals.validatedQuery as {
    page: number;
    limit: number;
  };
  const data = await listUserNotifications(userId, page, limit);
  res.status(200).json({ success: true, message: 'Notifications fetched', data });
};

export const readNotification = async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  const updated = await markNotificationRead(userId, req.params.notificationId);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Notification not found' });
    return;
  }
  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: { notificationId: req.params.notificationId },
  });
};

export const readAllNotifications = async (req: Request, res: Response) => {
  const userId = requireUser(req, res);
  if (!userId) return;
  const updatedCount = await markAllNotificationsRead(userId);
  res.status(200).json({ success: true, message: 'Notifications marked as read', data: { updatedCount } });
};
