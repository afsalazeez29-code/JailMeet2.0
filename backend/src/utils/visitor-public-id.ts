import { randomInt } from 'crypto';
import { Prisma } from '@prisma/client';

const VISITOR_PUBLIC_ID_ALPHABET =
  'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const VISITOR_PUBLIC_ID_LENGTH = 8;
export const VISITOR_PUBLIC_ID_MAX_ATTEMPTS = 5;

export class VisitorPublicIdGenerationError extends Error {
  constructor() {
    super('Unable to generate a unique Visitor ID');
    this.name = 'VisitorPublicIdGenerationError';
  }
}

export const generateVisitorPublicIdCandidate = (): string => {
  let suffix = '';

  for (let index = 0; index < VISITOR_PUBLIC_ID_LENGTH; index += 1) {
    suffix += VISITOR_PUBLIC_ID_ALPHABET[
      randomInt(VISITOR_PUBLIC_ID_ALPHABET.length)
    ];
  }

  return `VST-${suffix}`;
};

export const generateUniqueVisitorPublicId = async (
  client: Pick<Prisma.TransactionClient, 'visitorProfile'>,
): Promise<string> => {
  for (
    let attempt = 0;
    attempt < VISITOR_PUBLIC_ID_MAX_ATTEMPTS;
    attempt += 1
  ) {
    const publicId = generateVisitorPublicIdCandidate();
    const existingProfile = await client.visitorProfile.findUnique({
      where: { publicId },
      select: { id: true },
    });

    if (!existingProfile) return publicId;
  }

  throw new VisitorPublicIdGenerationError();
};

export const isVisitorPublicIdCollision = (error: unknown): boolean => {
  if (
    !(error instanceof Prisma.PrismaClientKnownRequestError) ||
    error.code !== 'P2002'
  ) {
    return false;
  }

  const metadata = JSON.stringify(error.meta ?? {});
  return /publicId|VisitorProfile_publicId_key/i.test(metadata);
};
