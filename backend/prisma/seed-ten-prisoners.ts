import 'dotenv/config';

import { readFile } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import type { UploadApiResponse } from 'cloudinary';

import cloudinary from '../src/config/cloudinary';
import prisma from '../src/config/prisma';

const PRISONER_IMAGE_FOLDER = 'jailmeet/prisoners';

type SeedPrisoner = {
  publicId: string;
  name: string;
  email: string;
  passwordKey: string;
  age: number;
  gender: 'MALE';
  dateOfBirth: string | null;
  nationality: string;
  admissionDate: string;
  cellNumber: string;
  imagePath: string;
  imageIdentifier: string;
};

const prisonerImageDirectory = path.resolve(
  __dirname,
  '../../Frontend/public/images/Prisoners',
);

const prisoners: SeedPrisoner[] = [
  {
    publicId: 'PRN-001',
    name: 'Fenjamin Lotanyahu',
    email: 'fenjaminlotanyahu@gmail.com',
    passwordKey: 'SEED_PRN_001_PASSWORD',
    age: 76,
    gender: 'MALE',
    dateOfBirth: '1949-10-21',
    nationality: 'Palestine',
    admissionDate: '2025-01-15',
    cellNumber: 'A-101',
    imagePath: path.join(prisonerImageDirectory, 'Fenjamin-Lotanyahu.jpg'),
    imageIdentifier: 'prn-001-profile',
  },
  {
    publicId: 'PRN-002',
    name: 'Dawood Ibrahim',
    email: 'dawoodibrahim@gmail.com',
    passwordKey: 'SEED_PRN_002_PASSWORD',
    age: 70,
    gender: 'MALE',
    dateOfBirth: '1955-12-26',
    nationality: 'Indian',
    admissionDate: '2025-02-10',
    cellNumber: 'A-102',
    imagePath: path.join(prisonerImageDirectory, 'Dawood-Ibrahim.jpg'),
    imageIdentifier: 'prn-002-profile',
  },
  {
    publicId: 'PRN-003',
    name: 'Jeffrey Epstein',
    email: 'jeffreyepstein@gmail.com',
    passwordKey: 'SEED_PRN_003_PASSWORD',
    age: 66,
    gender: 'MALE',
    dateOfBirth: '1953-01-20',
    nationality: 'American',
    admissionDate: '2025-03-05',
    cellNumber: 'B-201',
    imagePath: path.join(prisonerImageDirectory, 'Jeffrey-Epstein.jpg'),
    imageIdentifier: 'prn-003-profile',
  },
  {
    publicId: 'PRN-004',
    name: 'Do Lund Trump',
    email: 'dolundtrump@gmail.com',
    passwordKey: 'SEED_PRN_004_PASSWORD',
    age: 80,
    gender: 'MALE',
    dateOfBirth: '1946-06-14',
    nationality: 'American',
    admissionDate: '2025-04-12',
    cellNumber: 'B-202',
    imagePath: path.join(prisonerImageDirectory, 'Do-Lund-Trump.jpg'),
    imageIdentifier: 'prn-004-profile',
  },
  {
    publicId: 'PRN-005',
    name: 'Adolf Hitler',
    email: 'adolfhitler@gmail.com',
    passwordKey: 'SEED_PRN_005_PASSWORD',
    age: 56,
    gender: 'MALE',
    dateOfBirth: '1889-04-20',
    nationality: 'German',
    admissionDate: '2025-05-18',
    cellNumber: 'C-301',
    imagePath: path.join(prisonerImageDirectory, 'Adolf-Hitler.jpg'),
    imageIdentifier: 'prn-005-profile',
  },
  {
    publicId: 'PRN-006',
    name: 'Osama bin Laden',
    email: 'osamabinladen@gmail.com',
    passwordKey: 'SEED_PRN_006_PASSWORD',
    age: 54,
    gender: 'MALE',
    dateOfBirth: '1957-03-10',
    nationality: 'Saudi Arabian',
    admissionDate: '2025-06-22',
    cellNumber: 'C-302',
    imagePath: path.join(prisonerImageDirectory, 'Osama-Bin-laden.jpg'),
    imageIdentifier: 'prn-006-profile',
  },
  {
    publicId: 'PRN-007',
    name: 'Pablo Emilio Escobar Gaviria',
    email: 'pabloescobar@gmail.com',
    passwordKey: 'SEED_PRN_007_PASSWORD',
    age: 44,
    gender: 'MALE',
    dateOfBirth: '1949-12-01',
    nationality: 'Colombian',
    admissionDate: '2025-07-09',
    cellNumber: 'D-401',
    imagePath: path.join(prisonerImageDirectory, 'Pablo-Escobar.jpg'),
    imageIdentifier: 'prn-007-profile',
  },
  {
    publicId: 'PRN-008',
    name: 'Mahendra Modi',
    email: 'mahendramodi@gmail.com',
    passwordKey: 'SEED_PRN_008_PASSWORD',
    age: 75,
    gender: 'MALE',
    dateOfBirth: '1950-09-17',
    nationality: 'Indian',
    admissionDate: '2025-08-14',
    cellNumber: 'D-402',
    imagePath: path.join(prisonerImageDirectory, 'Mahendra-Modi.jpg'),
    imageIdentifier: 'prn-008-profile',
  },
  {
    publicId: 'PRN-009',
    name: 'Thanos',
    email: 'thanos@gmail.com',
    passwordKey: 'SEED_PRN_009_PASSWORD',
    age: 1000,
    gender: 'MALE',
    dateOfBirth: null,
    nationality: 'Titanian',
    admissionDate: '2025-09-20',
    cellNumber: 'E-501',
    imagePath: path.join(prisonerImageDirectory, 'Thanos.jpg'),
    imageIdentifier: 'prn-009-profile',
  },
  {
    publicId: 'PRN-010',
    name: 'Genghis Khan',
    email: 'genghiskhan@gmail.com',
    passwordKey: 'SEED_PRN_010_PASSWORD',
    age: 65,
    gender: 'MALE',
    dateOfBirth: null,
    nationality: 'Mongol',
    admissionDate: '2025-10-25',
    cellNumber: 'E-502',
    imagePath: path.join(prisonerImageDirectory, 'Genghis-Khan.jpg'),
    imageIdentifier: 'prn-010-profile',
  },
];

const requireProductionIntent = (): void => {
  if (process.env.SEED_TEN_PRISONERS_CONFIRM_PRODUCTION !== 'YES') {
    throw new Error('Production seed confirmation is missing');
  }

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
};

const readSeedPasswords = (): Map<string, string> => {
  const passwords = new Map<string, string>();
  for (const prisoner of prisoners) {
    const password = process.env[prisoner.passwordKey];
    if (!password) {
      throw new Error(`Required seed password is missing for ${prisoner.publicId}`);
    }
    passwords.set(prisoner.publicId, password);
  }
  return passwords;
};

const validateLocalImages = async (): Promise<void> => {
  const uniquePaths = new Set(prisoners.map((prisoner) => prisoner.imagePath));
  if (uniquePaths.size !== prisoners.length) {
    throw new Error('Prisoner seed image paths must be unique');
  }

  for (const prisoner of prisoners) {
    let image: Buffer;
    try {
      image = await readFile(prisoner.imagePath);
    } catch {
      throw new Error(`Local image is missing for ${prisoner.publicId}`);
    }

    const isJpeg =
      image.length >= 4 &&
      image[0] === 0xff &&
      image[1] === 0xd8 &&
      image[image.length - 2] === 0xff &&
      image[image.length - 1] === 0xd9;
    if (!isJpeg) throw new Error(`Local image is not a valid JPEG for ${prisoner.publicId}`);
  }
};

const hasValidImageMetadata = (profile: {
  profilePic: string | null;
  profileImagePublicId: string | null;
} | null): profile is { profilePic: string; profileImagePublicId: string } =>
  Boolean(
    profile?.profilePic?.startsWith('https://') &&
      profile.profileImagePublicId?.trim(),
  );

const destroyAssets = async (publicIds: string[]): Promise<void> => {
  for (const publicId of publicIds) {
    try {
      await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        resource_type: 'image',
      });
    } catch {
      console.warn('[TenPrisonerSeed] Cloudinary cleanup was unsuccessful');
    }
  }
};

const uploadPrisonerImage = async (
  prisoner: SeedPrisoner,
): Promise<UploadApiResponse> => {
  try {
    return await cloudinary.uploader.upload(prisoner.imagePath, {
      folder: PRISONER_IMAGE_FOLDER,
      public_id: prisoner.imageIdentifier,
      resource_type: 'image',
      overwrite: true,
      invalidate: true,
      secure: true,
      transformation: [
        { width: 512, height: 512, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good', fetch_format: 'jpg' },
      ],
    });
  } catch {
    throw new Error(`Cloudinary upload failed for ${prisoner.publicId}`);
  }
};

async function main(): Promise<void> {
  requireProductionIntent();
  const passwords = readSeedPasswords();
  await validateLocalImages();

  const emails = prisoners.map((prisoner) => prisoner.email);
  const publicIds = prisoners.map((prisoner) => prisoner.publicId);
  const [usersByEmail, profilesByPublicId] = await Promise.all([
    prisma.user.findMany({
      where: { email: { in: emails } },
      select: {
        id: true,
        email: true,
        role: true,
        prisonerProfile: {
          select: {
            publicId: true,
            profilePic: true,
            profileImagePublicId: true,
          },
        },
      },
    }),
    prisma.prisonerProfile.findMany({
      where: { publicId: { in: publicIds } },
      select: {
        publicId: true,
        user: { select: { email: true, role: true } },
      },
    }),
  ]);

  const emailMap = new Map(usersByEmail.map((user) => [user.email, user]));
  const publicIdMap = new Map(
    profilesByPublicId.map((profile) => [profile.publicId, profile]),
  );
  const conflicts: string[] = [];

  for (const prisoner of prisoners) {
    const emailOwner = emailMap.get(prisoner.email);
    const publicIdOwner = publicIdMap.get(prisoner.publicId);

    if (emailOwner && emailOwner.role !== Role.PRISONER) {
      conflicts.push(`${prisoner.email} belongs to a non-Prisoner account`);
    }
    if (
      emailOwner &&
      emailOwner.prisonerProfile?.publicId !== prisoner.publicId
    ) {
      conflicts.push(`${prisoner.email} belongs to another Prisoner public ID`);
    }
    if (publicIdOwner && publicIdOwner.user.email !== prisoner.email) {
      conflicts.push(`${prisoner.publicId} belongs to another email`);
    }
    if (
      publicIdOwner &&
      publicIdOwner.user.role !== Role.PRISONER
    ) {
      conflicts.push(`${prisoner.publicId} belongs to a non-Prisoner account`);
    }
  }

  if (conflicts.length) {
    throw new Error(`Seed conflict detected: ${conflicts.join('; ')}`);
  }

  type ImageMetadata = {
    profilePic: string;
    profileImagePublicId: string;
    uploadedNow: boolean;
    previousPublicId: string | null;
  };
  const imageMetadata = new Map<string, ImageMetadata>();
  const newlyUploaded: string[] = [];

  try {
    for (const prisoner of prisoners) {
      const existingProfile = emailMap.get(prisoner.email)?.prisonerProfile ?? null;
      if (hasValidImageMetadata(existingProfile)) {
        imageMetadata.set(prisoner.publicId, {
          profilePic: existingProfile.profilePic,
          profileImagePublicId: existingProfile.profileImagePublicId,
          uploadedNow: false,
          previousPublicId: existingProfile.profileImagePublicId,
        });
        continue;
      }

      const uploaded = await uploadPrisonerImage(prisoner);
      newlyUploaded.push(uploaded.public_id);
      imageMetadata.set(prisoner.publicId, {
        profilePic: uploaded.secure_url,
        profileImagePublicId: uploaded.public_id,
        uploadedNow: true,
        previousPublicId: existingProfile?.profileImagePublicId ?? null,
      });
    }
  } catch (error) {
    await destroyAssets(newlyUploaded);
    throw error;
  }

  const passwordHashes = new Map<string, string>();
  for (const prisoner of prisoners) {
    passwordHashes.set(
      prisoner.publicId,
      await bcrypt.hash(passwords.get(prisoner.publicId) as string, 12),
    );
  }

  const persistedAssets = new Set<string>();
  const results: Array<{
    publicId: string;
    email: string;
    profileImagePublicId: string;
    profilePic: string;
  }> = [];

  try {
    for (const prisoner of prisoners) {
      const image = imageMetadata.get(prisoner.publicId);
      const password = passwordHashes.get(prisoner.publicId);
      if (!image || !password) throw new Error('Prepared seed data is incomplete');

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.upsert({
          where: { email: prisoner.email },
          update: { password, role: Role.PRISONER, isActive: true },
          create: {
            email: prisoner.email,
            password,
            role: Role.PRISONER,
            isActive: true,
          },
          select: { id: true, email: true },
        });

        const profile = await tx.prisonerProfile.upsert({
          where: { userId: user.id },
          update: {
            publicId: prisoner.publicId,
            name: prisoner.name,
            age: prisoner.age,
            gender: prisoner.gender,
            dateOfBirth: prisoner.dateOfBirth
              ? new Date(`${prisoner.dateOfBirth}T00:00:00.000Z`)
              : null,
            nationality: prisoner.nationality,
            admissionDate: new Date(`${prisoner.admissionDate}T00:00:00.000Z`),
            cellNumber: prisoner.cellNumber,
            profilePic: image.profilePic,
            profileImagePublicId: image.profileImagePublicId,
          },
          create: {
            userId: user.id,
            publicId: prisoner.publicId,
            name: prisoner.name,
            age: prisoner.age,
            gender: prisoner.gender,
            dateOfBirth: prisoner.dateOfBirth
              ? new Date(`${prisoner.dateOfBirth}T00:00:00.000Z`)
              : null,
            nationality: prisoner.nationality,
            admissionDate: new Date(`${prisoner.admissionDate}T00:00:00.000Z`),
            cellNumber: prisoner.cellNumber,
            profilePic: image.profilePic,
            profileImagePublicId: image.profileImagePublicId,
          },
          select: {
            publicId: true,
            profilePic: true,
            profileImagePublicId: true,
          },
        });

        return { email: user.email ?? prisoner.email, profile };
      });

      if (image.uploadedNow) persistedAssets.add(image.profileImagePublicId);
      if (
        image.uploadedNow &&
        image.previousPublicId &&
        image.previousPublicId !== image.profileImagePublicId
      ) {
        await destroyAssets([image.previousPublicId]);
      }

      results.push({
        publicId: result.profile.publicId ?? prisoner.publicId,
        email: result.email,
        profileImagePublicId: result.profile.profileImagePublicId as string,
        profilePic: result.profile.profilePic as string,
      });
    }
  } catch {
    await destroyAssets(
      newlyUploaded.filter((publicId) => !persistedAssets.has(publicId)),
    );
    throw new Error('Prisoner records could not be saved');
  }

  console.log(JSON.stringify({ success: true, prisoners: results }, null, 2));
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : 'Prisoner seed failed';
    console.error(`[TenPrisonerSeed] ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
