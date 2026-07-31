import 'dotenv/config';

import { readFile } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import type { UploadApiResponse } from 'cloudinary';

import cloudinary from '../src/config/cloudinary';
import prisma from '../src/config/prisma';

const OFFICER_IMAGE_FOLDER = 'jailmeet/officers';
const PRODUCTION_CONFIRMATION = 'YES';

type SeedOfficer = {
  publicId: string;
  name: string;
  email: string;
  passwordKey:
    | 'SEED_OFR_001_PASSWORD'
    | 'SEED_OFR_002_PASSWORD'
    | 'SEED_OFR_003_PASSWORD'
    | 'SEED_OFR_004_PASSWORD';
  phone: string;
  designation: string;
  department: string;
  joiningDate: string;
  shift: string;
  officeLocation: string;
  imagePath: string;
  imageIdentifier: string;
};

const frontendOfficerImages = path.resolve(
  __dirname,
  '../../Frontend/public/images/officer',
);

const officers: SeedOfficer[] = [
  {
    publicId: 'OFR-001',
    name: 'Kim Jong On',
    email: 'kimjongon@gmail.com',
    passwordKey: 'SEED_OFR_001_PASSWORD',
    phone: '9000003001',
    designation: 'Senior Prison Officer',
    department: 'Visitor Management',
    joiningDate: '2021-01-15',
    shift: 'MORNING',
    officeLocation: 'Central Jail Visitor Desk',
    imagePath: path.join(frontendOfficerImages, 'Kim-Jong-On.jpg'),
    imageIdentifier: 'ofr-001-profile',
  },
  {
    publicId: 'OFR-002',
    name: 'Saddam Hussein',
    email: 'saddamhussein@gmail.com',
    passwordKey: 'SEED_OFR_002_PASSWORD',
    phone: '9000003002',
    designation: 'Chief Security Officer',
    department: 'Custody and Security',
    joiningDate: '2020-06-10',
    shift: 'EVENING',
    officeLocation: 'Central Jail Security Wing',
    imagePath: path.join(frontendOfficerImages, 'Saddam-Hussein.jpg'),
    imageIdentifier: 'ofr-002-profile',
  },
  {
    publicId: 'OFR-003',
    name: 'Wladimir Putin',
    email: 'wladimirputin@gmail.com',
    passwordKey: 'SEED_OFR_003_PASSWORD',
    phone: '9000003003',
    designation: 'Deputy Prison Superintendent',
    department: 'Prison Administration',
    joiningDate: '2019-03-20',
    shift: 'ROTATIONAL',
    officeLocation: 'Central Jail Administration Block',
    imagePath: path.join(frontendOfficerImages, 'Wladimir-Putin.jpg'),
    imageIdentifier: 'ofr-003-profile',
  },
  {
    publicId: 'OFR-004',
    name: 'Uzair Baloch',
    email: 'uzairbaloch@gmail.com',
    passwordKey: 'SEED_OFR_004_PASSWORD',
    phone: '9000003004',
    designation: 'Intelligence Officer',
    department: 'Intelligence and Monitoring',
    joiningDate: '2022-09-05',
    shift: 'NIGHT',
    officeLocation: 'Central Jail Intelligence Unit',
    imagePath: path.join(frontendOfficerImages, 'Uzair-Baloch.jpg'),
    imageIdentifier: 'ofr-004-profile',
  },
];

const requireProductionIntent = (): void => {
  if (
    process.env.SEED_FOUR_OFFICERS_CONFIRM_PRODUCTION !==
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

  for (const officer of officers) {
    const password = process.env[officer.passwordKey];
    if (!password) {
      throw new Error(`Required seed password is missing for ${officer.publicId}`);
    }
    passwords.set(officer.publicId, password);
  }

  return passwords;
};

const validateLocalImages = async (): Promise<void> => {
  const uniquePaths = new Set(officers.map((officer) => officer.imagePath));
  if (uniquePaths.size !== officers.length) {
    throw new Error('Officer seed image paths must be unique');
  }

  for (const officer of officers) {
    let image: Buffer;
    try {
      image = await readFile(officer.imagePath);
    } catch {
      throw new Error(`Local JPEG is missing for ${officer.publicId}`);
    }

    const isJpeg =
      image.length >= 4 &&
      image[0] === 0xff &&
      image[1] === 0xd8 &&
      image[image.length - 2] === 0xff &&
      image[image.length - 1] === 0xd9;
    if (!isJpeg) throw new Error(`Local image is not a valid JPEG for ${officer.publicId}`);
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
      console.warn('[FourOfficerSeed] Cloudinary cleanup was unsuccessful');
    }
  }
};

const uploadOfficerImage = async (
  officer: SeedOfficer,
): Promise<UploadApiResponse> => {
  try {
    return await cloudinary.uploader.upload(officer.imagePath, {
      folder: OFFICER_IMAGE_FOLDER,
      public_id: officer.imageIdentifier,
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
    throw new Error(`Cloudinary upload failed for ${officer.publicId}`);
  }
};

async function main(): Promise<void> {
  requireProductionIntent();
  const passwords = readSeedPasswords();
  await validateLocalImages();

  const emails = officers.map((officer) => officer.email);
  const publicIds = officers.map((officer) => officer.publicId);
  const [usersByEmail, profilesByPublicId] = await Promise.all([
    prisma.user.findMany({
      where: { email: { in: emails } },
      select: {
        id: true,
        email: true,
        role: true,
        officerProfile: {
          select: {
            publicId: true,
            profilePic: true,
            profileImagePublicId: true,
          },
        },
      },
    }),
    prisma.officerProfile.findMany({
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

  for (const officer of officers) {
    const emailOwner = emailMap.get(officer.email);
    const publicIdOwner = publicIdMap.get(officer.publicId);

    if (emailOwner && emailOwner.role !== Role.OFFICER) {
      conflicts.push(`${officer.email} belongs to a non-Officer account`);
    }
    if (emailOwner && emailOwner.officerProfile?.publicId !== officer.publicId) {
      conflicts.push(`${officer.email} belongs to another Officer public ID`);
    }
    if (publicIdOwner && publicIdOwner.user.email !== officer.email) {
      conflicts.push(`${officer.publicId} belongs to another email`);
    }
    if (
      publicIdOwner?.user.role !== undefined &&
      publicIdOwner.user.role !== Role.OFFICER
    ) {
      conflicts.push(`${officer.publicId} belongs to a non-Officer account`);
    }
  }

  if (conflicts.length) {
    throw new Error(`Seed conflict detected: ${conflicts.join('; ')}`);
  }

  const passwordHashes = new Map<string, string>();
  for (const officer of officers) {
    passwordHashes.set(
      officer.publicId,
      await bcrypt.hash(passwords.get(officer.publicId) as string, 12),
    );
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
    for (const officer of officers) {
      const existingProfile = emailMap.get(officer.email)?.officerProfile ?? null;
      if (hasValidImageMetadata(existingProfile)) {
        imageMetadata.set(officer.publicId, {
          profilePic: existingProfile.profilePic,
          profileImagePublicId: existingProfile.profileImagePublicId,
          uploadedNow: false,
          previousPublicId: existingProfile.profileImagePublicId,
        });
        continue;
      }

      const uploaded = await uploadOfficerImage(officer);
      newlyUploaded.push(uploaded.public_id);
      imageMetadata.set(officer.publicId, {
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

  const persistedAssets = new Set<string>();
  const results: Array<{
    publicId: string;
    email: string;
    profileImagePublicId: string;
    profilePic: string;
  }> = [];

  try {
    for (const officer of officers) {
      const image = imageMetadata.get(officer.publicId);
      const password = passwordHashes.get(officer.publicId);
      if (!image || !password) throw new Error('Prepared seed data is incomplete');

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.upsert({
          where: { email: officer.email },
          update: { password, role: Role.OFFICER, isActive: true },
          create: {
            email: officer.email,
            password,
            role: Role.OFFICER,
            isActive: true,
          },
          select: { id: true, email: true },
        });

        const profile = await tx.officerProfile.upsert({
          where: { userId: user.id },
          update: {
            publicId: officer.publicId,
            name: officer.name,
            phone: officer.phone,
            designation: officer.designation,
            department: officer.department,
            joiningDate: new Date(`${officer.joiningDate}T00:00:00.000Z`),
            shift: officer.shift,
            officeLocation: officer.officeLocation,
            profilePic: image.profilePic,
            profileImagePublicId: image.profileImagePublicId,
          },
          create: {
            userId: user.id,
            publicId: officer.publicId,
            name: officer.name,
            phone: officer.phone,
            designation: officer.designation,
            department: officer.department,
            joiningDate: new Date(`${officer.joiningDate}T00:00:00.000Z`),
            shift: officer.shift,
            officeLocation: officer.officeLocation,
            profilePic: image.profilePic,
            profileImagePublicId: image.profileImagePublicId,
          },
          select: {
            publicId: true,
            profilePic: true,
            profileImagePublicId: true,
          },
        });

        return { email: user.email ?? officer.email, profile };
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
        publicId: result.profile.publicId ?? officer.publicId,
        email: result.email,
        profileImagePublicId: result.profile.profileImagePublicId as string,
        profilePic: result.profile.profilePic as string,
      });
    }
  } catch {
    await destroyAssets(
      newlyUploaded.filter((publicId) => !persistedAssets.has(publicId)),
    );
    throw new Error('Officer records could not be saved');
  }

  const verifiedUsers = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: {
      email: true,
      role: true,
      isActive: true,
      officerProfile: {
        select: {
          publicId: true,
          name: true,
          phone: true,
          designation: true,
          department: true,
          joiningDate: true,
          shift: true,
          officeLocation: true,
          profilePic: true,
          profileImagePublicId: true,
        },
      },
    },
  });
  const verifiedByEmail = new Map(
    verifiedUsers.map((user) => [user.email, user]),
  );

  for (const officer of officers) {
    const user = verifiedByEmail.get(officer.email);
    const profile = user?.officerProfile;
    const image = imageMetadata.get(officer.publicId);
    const isExactMatch =
      user?.role === Role.OFFICER &&
      user.isActive &&
      profile?.publicId === officer.publicId &&
      profile.name === officer.name &&
      profile.phone === officer.phone &&
      profile.designation === officer.designation &&
      profile.department === officer.department &&
      profile.joiningDate?.toISOString().slice(0, 10) === officer.joiningDate &&
      profile.shift === officer.shift &&
      profile.officeLocation === officer.officeLocation &&
      profile.profilePic === image?.profilePic &&
      profile.profileImagePublicId === image?.profileImagePublicId;

    if (!isExactMatch) {
      throw new Error(`Saved Officer mapping verification failed for ${officer.publicId}`);
    }
  }

  console.log(JSON.stringify({ success: true, officers: results }, null, 2));
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : 'Officer seed failed';
    console.error(`[FourOfficerSeed] ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
