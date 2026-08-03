import { Prisma } from '@prisma/client';

import prisma from '../../config/prisma';

export type NotificationEvent = {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  dedupeKey?: string | null;
};

export const createNotification = async (
  event: NotificationEvent,
  db: Prisma.TransactionClient = prisma,
) => event.dedupeKey
  ? db.notification.upsert({
      where: { dedupeKey: event.dedupeKey },
      create: event,
      update: {},
    })
  : db.notification.create({ data: event });

export const createNotifications = async (
  events: NotificationEvent[],
  db: Prisma.TransactionClient = prisma,
) => events.length
  ? db.notification.createMany({ data: events, skipDuplicates: true })
  : { count: 0 };

export const listUserNotifications = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const where = { userId };
  const [items, totalItems, unreadCount] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        link: true,
        isRead: true,
        createdAt: true,
      },
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return {
    items: items.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })),
    unreadCount,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / limit)),
    },
  };
};

export const markNotificationRead = async (
  userId: string,
  notificationId: string,
) => {
  const result = await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });

  return result.count > 0;
};

export const markAllNotificationsRead = async (userId: string) => {
  const result = await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
  return result.count;
};
