import { randomUUID } from 'crypto';
import { Readable } from 'stream';
import type { UploadApiResponse } from 'cloudinary';

import cloudinary from '../../config/cloudinary';
import prisma from '../../config/prisma';

const VISITOR_IMAGE_FOLDER = 'jailmeet/visitors';

export class VisitorImageServiceError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'VisitorImageServiceError';
    this.statusCode = statusCode;
  }
}

const detectImageFormat = (buffer: Buffer): 'jpg' | 'png' | 'webp' | null => {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return 'jpg';
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
  ) {
    return 'png';
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp';
  }

  return null;
};

const uploadImage = async (buffer: Buffer): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: VISITOR_IMAGE_FOLDER,
        public_id: `visitor-${randomUUID()}`,
        resource_type: 'image',
        overwrite: false,
        format: 'jpg',
        transformation: [
          { width: 512, height: 512, crop: 'fill', gravity: 'center' },
          { quality: 'auto:good', fetch_format: 'jpg' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error('PROFILE_IMAGE_UPLOAD_FAILED'));
          return;
        }

        resolve(result);
      },
    );

    Readable.from(buffer).pipe(upload);
  });

const destroyImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: 'image',
  });
};

export const replaceVisitorProfileImage = async (
  userId: string,
  image: Express.Multer.File,
): Promise<{ profileImageUrl: string }> => {
  const format = detectImageFormat(image.buffer);

  if (!format) {
    throw new VisitorImageServiceError(
      400,
      'Select a valid JPEG, PNG, or WebP image',
    );
  }

  const profile = await prisma.visitorProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      profileImagePublicId: true,
    },
  });

  if (!profile) {
    throw new VisitorImageServiceError(404, 'Visitor profile not found');
  }

  let uploaded: UploadApiResponse;

  try {
    uploaded = await uploadImage(image.buffer);
  } catch {
    throw new VisitorImageServiceError(502, 'Unable to upload profile picture');
  }

  try {
    await prisma.visitorProfile.update({
      where: { id: profile.id },
      data: {
        profilePic: uploaded.secure_url,
        profileImagePublicId: uploaded.public_id,
      },
    });
  } catch {
    try {
      await destroyImage(uploaded.public_id);
    } catch {
      console.warn('[VisitorImageService] New image cleanup was unsuccessful');
    }

    throw new VisitorImageServiceError(500, 'Unable to save profile picture');
  }

  if (profile.profileImagePublicId) {
    try {
      await destroyImage(profile.profileImagePublicId);
    } catch {
      console.warn('[VisitorImageService] Previous image cleanup was unsuccessful');
    }
  }

  return { profileImageUrl: uploaded.secure_url };
};

export const removeVisitorProfileImage = async (
  userId: string,
): Promise<{ profileImageUrl: null }> => {
  const profile = await prisma.visitorProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      profileImagePublicId: true,
    },
  });

  if (!profile) {
    throw new VisitorImageServiceError(404, 'Visitor profile not found');
  }

  await prisma.visitorProfile.update({
    where: { id: profile.id },
    data: {
      profilePic: null,
      profileImagePublicId: null,
    },
  });

  if (profile.profileImagePublicId) {
    try {
      await destroyImage(profile.profileImagePublicId);
    } catch {
      console.warn('[VisitorImageService] Removed image cleanup was unsuccessful');
    }
  }

  return { profileImageUrl: null };
};
