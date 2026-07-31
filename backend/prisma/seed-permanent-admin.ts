import 'dotenv/config';

import { readFile, stat } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import type { UploadApiResponse } from 'cloudinary';

import cloudinary from '../src/config/cloudinary';
import prisma from '../src/config/prisma';

const ADMIN_EMAIL = 'admin@jailmeet.com';
const ADMIN_NAME = 'P R Beyonder';
const ADMIN_IMAGE_FOLDER = 'jailmeet/admin';
const ADMIN_IMAGE_IDENTIFIER = 'permanent-admin-profile';
const PRODUCTION_CONFIRMATION = 'YES';
const adminImagePath = path.resolve(
  __dirname,
  '../../Frontend/public/images/admin/P R Beyonder.png',
);

const requireProductionIntent = (): string => {
  if (
    process.env.SEED_PERMANENT_ADMIN_CONFIRM_PRODUCTION !==
    PRODUCTION_CONFIRMATION
  ) {
    throw new Error('Production seed confirmation is missing');
  }

  const password = process.env.SEED_PERMANENT_ADMIN_PASSWORD;
  if (!password) throw new Error('Required Admin seed password is missing');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('Production database configuration is missing');

  let hostname = '';
  try {
    hostname = new URL(databaseUrl).hostname;
  } catch {
    throw new Error('Production database configuration is invalid');
  }

  if (!hostname.endsWith('.neon.tech')) {
    throw new Error('The configured database is not a Neon endpoint');
  }
  if (process.env.CLOUDINARY_CLOUD_NAME !== 'dgovvdud9') {
    throw new Error('The configured Cloudinary cloud is not approved');
  }

  return password;
};

const validateLocalImage = async (): Promise<void> => {
  let fileStats;
  let image: Buffer;

  try {
    [fileStats, image] = await Promise.all([
      stat(adminImagePath),
      readFile(adminImagePath),
    ]);
  } catch {
    throw new Error('The local Admin PNG is missing');
  }

  if (!fileStats.isFile() || image.length === 0) {
    throw new Error('The local Admin image is not a non-empty regular file');
  }

  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const isPng =
    image.length >= pngSignature.length &&
    pngSignature.every((byte, index) => image[index] === byte);
  if (!isPng) throw new Error('The local Admin image is not a valid PNG');
};

const hasValidImageMetadata = (profile: {
  profilePic: string | null;
  profileImagePublicId: string | null;
} | null): profile is { profilePic: string; profileImagePublicId: string } =>
  Boolean(
    profile?.profilePic?.startsWith('https://') &&
      profile.profileImagePublicId?.trim(),
  );

const uploadAdminImage = async (): Promise<UploadApiResponse> => {
  try {
    return await cloudinary.uploader.upload(adminImagePath, {
      folder: ADMIN_IMAGE_FOLDER,
      public_id: ADMIN_IMAGE_IDENTIFIER,
      resource_type: 'image',
      overwrite: true,
      invalidate: true,
      secure: true,
    });
  } catch {
    throw new Error('Cloudinary upload failed for the permanent Admin');
  }
};

const destroyNewAsset = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: 'image',
    });
  } catch {
    console.warn('[PermanentAdminSeed] Cloudinary cleanup was unsuccessful');
  }
};

async function main(): Promise<void> {
  const password = requireProductionIntent();
  await validateLocalImage();

  const [admins, matchingEmailUser] = await Promise.all([
    prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        adminProfile: {
          select: {
            id: true,
            userId: true,
            name: true,
            profilePic: true,
            profileImagePublicId: true,
          },
        },
      },
    }),
    prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
      select: { id: true, email: true, role: true },
    }),
  ]);

  if (admins.length > 1) {
    throw new Error('Multiple Admin accounts exist; manual database review is required');
  }
  if (matchingEmailUser && matchingEmailUser.role !== Role.ADMIN) {
    throw new Error('The permanent Admin email belongs to a non-Admin account');
  }
  if (admins.length === 1 && admins[0].email !== ADMIN_EMAIL) {
    throw new Error(`Another Admin account already exists: ${admins[0].email ?? 'no email'}`);
  }

  const existingAdmin = admins[0] ?? null;
  const passwordHash = await bcrypt.hash(password, 12);

  let profilePic: string;
  let profileImagePublicId: string;
  let uploadedNow = false;

  if (hasValidImageMetadata(existingAdmin?.adminProfile ?? null)) {
    profilePic = existingAdmin.adminProfile.profilePic;
    profileImagePublicId = existingAdmin.adminProfile.profileImagePublicId;
  } else {
    const uploaded = await uploadAdminImage();
    profilePic = uploaded.secure_url;
    profileImagePublicId = uploaded.public_id;
    uploadedNow = true;
  }

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email: ADMIN_EMAIL },
        update: {
          password: passwordHash,
          role: Role.ADMIN,
          isActive: true,
        },
        create: {
          email: ADMIN_EMAIL,
          password: passwordHash,
          role: Role.ADMIN,
          isActive: true,
        },
        select: { id: true },
      });

      await tx.adminProfile.upsert({
        where: { userId: user.id },
        update: {
          name: ADMIN_NAME,
          profilePic,
          profileImagePublicId,
        },
        create: {
          userId: user.id,
          name: ADMIN_NAME,
          profilePic,
          profileImagePublicId,
        },
      });
    });
  } catch {
    if (uploadedNow) await destroyNewAsset(profileImagePublicId);
    throw new Error('The permanent Admin records could not be saved');
  }

  const verifiedAdmins = await prisma.user.findMany({
    where: { role: Role.ADMIN },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      isActive: true,
      adminProfile: {
        select: {
          id: true,
          userId: true,
          name: true,
          profilePic: true,
          profileImagePublicId: true,
        },
      },
    },
  });
  const verifiedAdmin = verifiedAdmins[0];
  const passwordIsBcryptHash = /^\$2[aby]\$12\$/.test(
    verifiedAdmin?.password ?? '',
  );
  const exactMatch =
    verifiedAdmins.length === 1 &&
    verifiedAdmin?.email === ADMIN_EMAIL &&
    verifiedAdmin.role === Role.ADMIN &&
    verifiedAdmin.isActive &&
    passwordIsBcryptHash &&
    verifiedAdmin.adminProfile?.userId === verifiedAdmin.id &&
    verifiedAdmin.adminProfile.name === ADMIN_NAME &&
    verifiedAdmin.adminProfile.profilePic === profilePic &&
    verifiedAdmin.adminProfile.profileImagePublicId === profileImagePublicId;

  if (!exactMatch) {
    throw new Error('Permanent Admin verification failed');
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        admin: {
          email: verifiedAdmin.email,
          name: verifiedAdmin.adminProfile?.name,
          role: verifiedAdmin.role,
          isActive: verifiedAdmin.isActive,
          adminProfileLinked: true,
          profilePic,
          profileImagePublicId,
          singletonAdminCount: verifiedAdmins.length,
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : 'Permanent Admin seed failed';
    console.error(`[PermanentAdminSeed] ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
