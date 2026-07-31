import 'dotenv/config';

import { readFile } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import type { UploadApiResponse } from 'cloudinary';

import cloudinary from '../src/config/cloudinary';
import prisma from '../src/config/prisma';

const VISITOR_IMAGE_FOLDER = 'jailmeet/visitors';
const PRODUCTION_CONFIRMATION = 'YES';

type SeedVisitor = {
  publicId: string;
  name: string;
  email: string;
  passwordKey:
    | 'SEED_VIS_001_PASSWORD'
    | 'SEED_VIS_002_PASSWORD'
    | 'SEED_VIS_003_PASSWORD'
    | 'SEED_VIS_004_PASSWORD';
  phone: string;
  address: string;
  city: string | null;
  state: string;
  country: string;
  zip: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  imagePath: string;
  imageIdentifier: string;
};

const frontendVisitorImages = path.resolve(
  __dirname,
  '../../Frontend/public/images/visitor',
);

const visitors: SeedVisitor[] = [
  {
    publicId: 'VIS-001',
    name: 'I Show-Speed',
    email: 'ishowspeed@gmail.com',
    passwordKey: 'SEED_VIS_001_PASSWORD',
    phone: '5550100001',
    address: 'Cincinnati, Ohio',
    city: 'Cincinnati',
    state: 'Ohio',
    country: 'United States',
    zip: '45224',
    dateOfBirth: '2005-01-21',
    gender: 'MALE',
    imagePath: path.join(frontendVisitorImages, 'IShow-Speed.jpg'),
    imageIdentifier: 'vis-001-profile',
  },
  {
    publicId: 'VIS-002',
    name: 'Uma North',
    email: 'umanorth@gmail.com',
    passwordKey: 'SEED_VIS_002_PASSWORD',
    phone: '5550100002',
    address: 'Moscow Oblast, Russia',
    city: null,
    state: 'Moscow Oblast',
    country: 'Russia',
    zip: '142100',
    dateOfBirth: '2002-05-22',
    gender: 'FEMALE',
    imagePath: path.join(frontendVisitorImages, 'uma-north.jpg'),
    imageIdentifier: 'vis-002-profile',
  },
  {
    publicId: 'VIS-003',
    name: 'Cristiano Ronaldo',
    email: 'cristianoronaldo@gmail.com',
    passwordKey: 'SEED_VIS_003_PASSWORD',
    phone: '5550100003',
    address: 'Funchal, Madeira',
    city: 'Funchal',
    state: 'Madeira',
    country: 'Portugal',
    zip: '9000',
    dateOfBirth: '1985-02-05',
    gender: 'MALE',
    imagePath: path.join(frontendVisitorImages, 'Cristiano-Ronaldo.jpg'),
    imageIdentifier: 'vis-003-profile',
  },
  {
    publicId: 'VIS-004',
    name: 'Khabib Nurmagomedov',
    email: 'khabibnurmagomedov@gmail.com',
    passwordKey: 'SEED_VIS_004_PASSWORD',
    phone: '5550100004',
    address: 'Sildi, Tsumadinsky District',
    city: 'Sildi',
    state: 'Republic of Dagestan',
    country: 'Russia',
    zip: '368320',
    dateOfBirth: '1988-09-20',
    gender: 'MALE',
    imagePath: path.join(frontendVisitorImages, 'Khabib-Nurmagomedov.jpg'),
    imageIdentifier: 'vis-004-profile',
  },
];

const requireProductionIntent = (): void => {
  if (
    process.env.SEED_FOUR_VISITORS_CONFIRM_PRODUCTION !==
    PRODUCTION_CONFIRMATION
  ) {
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

  for (const visitor of visitors) {
    const password = process.env[visitor.passwordKey];
    if (!password || password.length < 12) {
      throw new Error(`Required seed password is missing for ${visitor.publicId}`);
    }
    passwords.set(visitor.publicId, password);
  }

  return passwords;
};

const validateLocalImages = async (): Promise<void> => {
  const uniquePaths = new Set(visitors.map((visitor) => visitor.imagePath));
  if (uniquePaths.size !== visitors.length) {
    throw new Error('Visitor seed image paths must be unique');
  }

  for (const visitor of visitors) {
    let image: Buffer;
    try {
      image = await readFile(visitor.imagePath);
    } catch {
      throw new Error(`Local JPEG is missing for ${visitor.publicId}`);
    }

    const isJpeg =
      image.length >= 4 &&
      image[0] === 0xff &&
      image[1] === 0xd8 &&
      image[image.length - 2] === 0xff &&
      image[image.length - 1] === 0xd9;
    if (!isJpeg) throw new Error(`Local image is not a valid JPEG for ${visitor.publicId}`);
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
      console.warn('[FourVisitorSeed] Cloudinary cleanup was unsuccessful');
    }
  }
};

const uploadVisitorImage = async (
  visitor: SeedVisitor,
): Promise<UploadApiResponse> => {
  try {
    return await cloudinary.uploader.upload(visitor.imagePath, {
      folder: VISITOR_IMAGE_FOLDER,
      public_id: visitor.imageIdentifier,
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
    throw new Error(`Cloudinary upload failed for ${visitor.publicId}`);
  }
};

async function main(): Promise<void> {
  requireProductionIntent();

  const emails = visitors.map((visitor) => visitor.email);
  const publicIds = visitors.map((visitor) => visitor.publicId);
  const [usersByEmail, profilesByPublicId] = await Promise.all([
    prisma.user.findMany({
      where: { email: { in: emails } },
      select: {
        id: true,
        email: true,
        role: true,
        visitorProfile: {
          select: {
            publicId: true,
            profilePic: true,
            profileImagePublicId: true,
          },
        },
      },
    }),
    prisma.visitorProfile.findMany({
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

  for (const visitor of visitors) {
    const emailOwner = emailMap.get(visitor.email);
    const publicIdOwner = publicIdMap.get(visitor.publicId);

    if (emailOwner && emailOwner.role !== Role.VISITOR) {
      conflicts.push(`${visitor.email} belongs to a non-Visitor account`);
    }
    if (
      emailOwner &&
      emailOwner.visitorProfile?.publicId !== visitor.publicId
    ) {
      conflicts.push(`${visitor.email} belongs to another Visitor public ID`);
    }
    if (publicIdOwner && publicIdOwner.user.email !== visitor.email) {
      conflicts.push(`${visitor.publicId} belongs to another email`);
    }
    if (publicIdOwner?.user.role !== undefined && publicIdOwner.user.role !== Role.VISITOR) {
      conflicts.push(`${visitor.publicId} belongs to a non-Visitor account`);
    }
  }

  if (conflicts.length) {
    throw new Error(`Seed conflict detected: ${conflicts.join('; ')}`);
  }

  await validateLocalImages();
  const passwords = readSeedPasswords();

  type ImageMetadata = {
    profilePic: string;
    profileImagePublicId: string;
    uploadedNow: boolean;
    previousPublicId: string | null;
  };
  const imageMetadata = new Map<string, ImageMetadata>();
  const newlyUploaded: string[] = [];

  try {
    for (const visitor of visitors) {
      const existingProfile = emailMap.get(visitor.email)?.visitorProfile ?? null;
      if (hasValidImageMetadata(existingProfile)) {
        imageMetadata.set(visitor.publicId, {
          profilePic: existingProfile.profilePic,
          profileImagePublicId: existingProfile.profileImagePublicId,
          uploadedNow: false,
          previousPublicId: existingProfile.profileImagePublicId,
        });
        continue;
      }

      const uploaded = await uploadVisitorImage(visitor);
      newlyUploaded.push(uploaded.public_id);
      imageMetadata.set(visitor.publicId, {
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

  const hashes = new Map<string, string>();
  for (const visitor of visitors) {
    hashes.set(
      visitor.publicId,
      await bcrypt.hash(passwords.get(visitor.publicId) as string, 12),
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
    for (const visitor of visitors) {
      const image = imageMetadata.get(visitor.publicId);
      const password = hashes.get(visitor.publicId);
      if (!image || !password) throw new Error('Prepared seed data is incomplete');

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.upsert({
          where: { email: visitor.email },
          update: {
            password,
            role: Role.VISITOR,
            isActive: true,
          },
          create: {
            email: visitor.email,
            password,
            role: Role.VISITOR,
            isActive: true,
          },
          select: { id: true, email: true },
        });

        const profile = await tx.visitorProfile.upsert({
          where: { userId: user.id },
          update: {
            publicId: visitor.publicId,
            name: visitor.name,
            phone: visitor.phone,
            address: visitor.address,
            city: visitor.city,
            state: visitor.state,
            country: visitor.country,
            zip: visitor.zip,
            dateOfBirth: new Date(`${visitor.dateOfBirth}T00:00:00.000Z`),
            gender: visitor.gender,
            profilePic: image.profilePic,
            profileImagePublicId: image.profileImagePublicId,
          },
          create: {
            userId: user.id,
            publicId: visitor.publicId,
            name: visitor.name,
            phone: visitor.phone,
            address: visitor.address,
            city: visitor.city,
            state: visitor.state,
            country: visitor.country,
            zip: visitor.zip,
            dateOfBirth: new Date(`${visitor.dateOfBirth}T00:00:00.000Z`),
            gender: visitor.gender,
            profilePic: image.profilePic,
            profileImagePublicId: image.profileImagePublicId,
          },
          select: {
            publicId: true,
            profilePic: true,
            profileImagePublicId: true,
          },
        });

        return { email: user.email ?? visitor.email, profile };
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
        publicId: result.profile.publicId ?? visitor.publicId,
        email: result.email,
        profileImagePublicId: result.profile.profileImagePublicId as string,
        profilePic: result.profile.profilePic as string,
      });
    }
  } catch {
    await destroyAssets(
      newlyUploaded.filter((publicId) => !persistedAssets.has(publicId)),
    );
    throw new Error('Visitor records could not be saved');
  }

  console.log(JSON.stringify({ success: true, visitors: results }, null, 2));
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : 'Visitor seed failed';
    console.error(`[FourVisitorSeed] ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
