import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const profileImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_PROFILE_IMAGE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      callback(new Error('UNSUPPORTED_PROFILE_IMAGE'));
      return;
    }

    callback(null, true);
  },
}).single('image');

export const acceptVisitorProfileImage = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  profileImageUpload(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    const message =
      error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE'
        ? 'Profile picture must be 5 MB or smaller'
        : 'Select one JPEG, PNG, or WebP image';

    res.status(400).json({ success: false, message });
  });
};
