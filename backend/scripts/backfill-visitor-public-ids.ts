import prisma from '../src/config/prisma';
import {
  generateUniqueVisitorPublicId,
  isVisitorPublicIdCollision,
  VISITOR_PUBLIC_ID_MAX_ATTEMPTS,
  VisitorPublicIdGenerationError,
} from '../src/utils/visitor-public-id';

const BATCH_SIZE = 100;

const backfillVisitorPublicIds = async (): Promise<void> => {
  let updatedCount = 0;
  let concurrentlyResolvedCount = 0;

  while (true) {
    const visitors = await prisma.visitorProfile.findMany({
      where: { publicId: null },
      orderBy: { id: 'asc' },
      take: BATCH_SIZE,
      select: { id: true },
    });

    if (visitors.length === 0) break;

    for (const visitor of visitors) {
      let resolved = false;

      for (
        let attempt = 0;
        attempt < VISITOR_PUBLIC_ID_MAX_ATTEMPTS;
        attempt += 1
      ) {
        const publicId = await generateUniqueVisitorPublicId(prisma);

        try {
          const result = await prisma.visitorProfile.updateMany({
            where: { id: visitor.id, publicId: null },
            data: { publicId },
          });

          if (result.count === 1) {
            updatedCount += 1;
            resolved = true;
            break;
          }

          const currentProfile = await prisma.visitorProfile.findUnique({
            where: { id: visitor.id },
            select: { publicId: true },
          });

          if (!currentProfile || currentProfile.publicId !== null) {
            concurrentlyResolvedCount += 1;
            resolved = true;
            break;
          }
        } catch (error: unknown) {
          if (isVisitorPublicIdCollision(error)) continue;
          throw error;
        }
      }

      if (!resolved) throw new VisitorPublicIdGenerationError();
    }
  }

  const [nullCountResult, duplicateResult, invalidFormatResult] =
    await Promise.all([
      prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint AS "count"
        FROM "VisitorProfile"
        WHERE "publicId" IS NULL
      `,
      prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint AS "count"
        FROM (
          SELECT "publicId"
          FROM "VisitorProfile"
          WHERE "publicId" IS NOT NULL
          GROUP BY "publicId"
          HAVING COUNT(*) > 1
        ) duplicates
      `,
      prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint AS "count"
        FROM "VisitorProfile"
        WHERE "publicId" IS NOT NULL
          AND "publicId" !~ '^VST-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{8}$'
      `,
    ]);

  const nullCount = nullCountResult[0]?.count ?? -1n;
  const duplicateCount = duplicateResult[0]?.count ?? -1n;
  const invalidFormatCount = invalidFormatResult[0]?.count ?? -1n;

  if (nullCount !== 0n || duplicateCount !== 0n || invalidFormatCount !== 0n) {
    throw new Error(
      `Visitor public ID backfill verification failed: null=${nullCount}, duplicate=${duplicateCount}, invalid-format=${invalidFormatCount}`,
    );
  }

  console.log(
    `Visitor ID backfill verified: updated=${updatedCount}, already-resolved=${concurrentlyResolvedCount}, null=0, duplicate=0, invalid-format=0.`,
  );
};

backfillVisitorPublicIds()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error
        ? error.message
        : 'Visitor public ID backfill failed',
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
