import 'dotenv/config';

import { Role } from '@prisma/client';

import prisma from '../src/config/prisma';

const PRODUCTION_CONFIRMATION = 'YES';

type PrisonerCaseUpdate = {
  publicId: string;
  officerPublicId: string;
  caseDetails: string;
  sentencePeriod: string;
  jailType: string;
  jailName: string;
};

const prisonerCases: PrisonerCaseUpdate[] = [
  {
    publicId: 'PRN-001',
    officerPublicId: 'OFR-001',
    caseDetails:
      'Fictional multiverse case scenario: allegations involving civilian harm, military actions against protected populations, and abuse of governmental authority. This is synthetic portfolio content and not a real JailMeet legal finding.',
    sentencePeriod: 'LIFE_IMPRISONMENT | Start: 2026-07-31 | End: LIFE',
    jailType: 'Galactic Tribunal Detention Facility',
    jailName: 'Justice Dome, Cell GC-1948',
  },
  {
    publicId: 'PRN-002',
    officerPublicId: 'OFR-002',
    caseDetails:
      'Fictional multiverse case scenario involving an organised-crime syndicate, unlawful financial networks, terrorism, and the 1993 Bombay attacks.',
    sentencePeriod: 'LIFE_IMPRISONMENT | Start: 2026-07-31 | End: LIFE',
    jailType: 'Quantum Lock Supermax',
    jailName: 'Andromeda Syndicate Containment Facility, Block D-Company',
  },
  {
    publicId: 'PRN-003',
    officerPublicId: 'OFR-003',
    caseDetails:
      'Fictional multiverse case scenario involving sexual exploitation, trafficking offences, abuse of vulnerable victims, and organised criminal conduct. Do not add unsupported accusations beyond this supplied fictional description.',
    sentencePeriod:
      'DEATH_SENTENCE / SOUL_IMPRISONMENT | Start: 2019-08-10 | End: NEVER',
    jailType: 'Void of Unforgivable Sins',
    jailName: 'The Black Cell of Stolen Childhoods, Level 0',
  },
  {
    publicId: 'PRN-004',
    officerPublicId: 'OFR-004',
    caseDetails:
      'Fictional multiverse case scenario involving corruption, abuse of public authority, election-related misconduct, financial wrongdoing, and mishandling of sensitive records. This is synthetic portfolio content, not a real legal judgment.',
    sentencePeriod:
      'FIXED_TERM — 150 YEARS | Start: 2026-07-31 | End: 2176-07-31',
    jailType: 'Demagogic Rehabilitation Dome',
    jailName: 'Mar-a-Lago Maximum Correctional Institution, Wing 45',
  },
  {
    publicId: 'PRN-005',
    officerPublicId: 'OFR-001',
    caseDetails:
      'Historical case scenario involving the Holocaust, mass murder of Jewish people and other persecuted groups, initiation of World War II, and crimes against humanity.',
    sentencePeriod:
      'DEATH_SENTENCE / ETERNAL MEMORY LOOP | Start: 1945-04-30 | End: NEVER',
    jailType: 'The Black Mirror of Absolute Judgment',
    jailName: 'The Fuhrerbunker of Eternal Shame, Ring 0',
  },
  {
    publicId: 'PRN-006',
    officerPublicId: 'OFR-002',
    caseDetails:
      'Historical case scenario involving international terrorism, the September 11 attacks, and deliberate mass killing of civilians.',
    sentencePeriod:
      'POSTHUMOUS DEATH_SENTENCE | Start: 2011-05-02 | End: ETERNITY',
    jailType: 'Infernal Plane of Regret',
    jailName: 'The Abyss of Burning Towers',
  },
  {
    publicId: 'PRN-007',
    officerPublicId: 'OFR-003',
    caseDetails:
      'Historical case scenario involving narco-terrorism, bomb attacks, murder, kidnapping, organised crime, and violent subversion of state institutions.',
    sentencePeriod:
      'POSTHUMOUS DEATH_SENTENCE | Start: 1993-12-02 | End: ETERNITY',
    jailType: 'Cartel Hell Dimension',
    jailName: 'Medellín Memorial Penitentiary of the Damned',
  },
  {
    publicId: 'PRN-008',
    officerPublicId: 'OFR-004',
    caseDetails:
      'Fictional multiverse case scenario involving alleged election misconduct, political-finance wrongdoing, abuse of democratic processes, and failure to prevent communal violence. This is synthetic portfolio content and not a real court finding.',
    sentencePeriod: 'LIFE_IMPRISONMENT | Start: 2026-07-31 | End: LIFE',
    jailType: 'Karmic Mirror Dimension',
    jailName: 'Penitentiary of Eternal Remorse, Cell 2002-GJ',
  },
  {
    publicId: 'PRN-009',
    officerPublicId: 'OFR-001',
    caseDetails:
      'Fictional case scenario involving use of a false identity in an Indian voting queue, interference with electoral procedures, and wasting police resources.',
    sentencePeriod:
      'FIXED_TERM — 500 YEARS | Start: 2026-07-31 | End: 2526-07-31',
    jailType: 'Bureaucratic Limbo Dimension',
    jailName:
      'Patna Central Correctional and Voter Re-registration Facility, Queue 7',
  },
  {
    publicId: 'PRN-010',
    officerPublicId: 'OFR-002',
    caseDetails:
      'Historical multiverse case scenario involving destructive conquest, mass civilian deaths, warfare, and extensive destruction across conquered territories.',
    sentencePeriod:
      'DEATH_SENTENCE / ETERNAL KARMIC CYCLE | Start: 1227-08-18 | End: ETERNITY',
    jailType: 'Samsaric Punishment Wheel',
    jailName: 'The Endless Steppe of Tears',
  },
];

const requireProductionIntent = (): void => {
  if (
    process.env.UPDATE_PRISONER_CASES_CONFIRM_PRODUCTION !==
    PRODUCTION_CONFIRMATION
  ) {
    throw new Error('Production update confirmation is missing');
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

async function main(): Promise<void> {
  requireProductionIntent();

  const prisonerPublicIds = prisonerCases.map((entry) => entry.publicId);
  const officerPublicIds = [
    ...new Set(prisonerCases.map((entry) => entry.officerPublicId)),
  ];

  const [prisoners, officers] = await Promise.all([
    prisma.prisonerProfile.findMany({
      where: { publicId: { in: prisonerPublicIds } },
      select: { id: true, publicId: true },
    }),
    prisma.officerProfile.findMany({
      where: { publicId: { in: officerPublicIds } },
      select: {
        id: true,
        publicId: true,
        user: { select: { role: true, isActive: true } },
      },
    }),
  ]);

  const prisonerMap = new Map(
    prisoners.map((prisoner) => [prisoner.publicId, prisoner]),
  );
  const officerMap = new Map(
    officers.map((officer) => [officer.publicId, officer]),
  );
  const missingPrisoners = prisonerPublicIds.filter(
    (publicId) => !prisonerMap.has(publicId),
  );
  const missingOfficers = officerPublicIds.filter(
    (publicId) => !officerMap.has(publicId),
  );

  if (missingPrisoners.length) {
    throw new Error(`Required Prisoner profiles are missing: ${missingPrisoners.join(', ')}`);
  }
  if (missingOfficers.length) {
    throw new Error(`Required Officer profiles are missing: ${missingOfficers.join(', ')}`);
  }

  const unavailableOfficers = officerPublicIds.filter((publicId) => {
    const officer = officerMap.get(publicId);
    return officer?.user.role !== Role.OFFICER || !officer.user.isActive;
  });
  if (unavailableOfficers.length) {
    throw new Error(
      `Required Officer profiles are inactive or have an invalid role: ${unavailableOfficers.join(', ')}`,
    );
  }

  await prisma.$transaction(
    prisonerCases.map((entry) => {
      const officer = officerMap.get(entry.officerPublicId);
      if (!officer) throw new Error(`Required Officer is missing for ${entry.publicId}`);

      return prisma.prisonerProfile.update({
        where: { publicId: entry.publicId },
        data: {
          caseDetails: entry.caseDetails,
          sentencePeriod: entry.sentencePeriod,
          jailType: entry.jailType,
          jailName: entry.jailName,
          createdByOfficerId: officer.id,
        },
      });
    }),
  );

  const verified = await prisma.prisonerProfile.findMany({
    where: { publicId: { in: prisonerPublicIds } },
    select: {
      publicId: true,
      caseDetails: true,
      sentencePeriod: true,
      jailType: true,
      jailName: true,
      createdByOfficerId: true,
    },
  });
  const verifiedMap = new Map(
    verified.map((prisoner) => [prisoner.publicId, prisoner]),
  );
  const results = prisonerCases.map((entry) => {
    const prisoner = verifiedMap.get(entry.publicId);
    const officer = officerMap.get(entry.officerPublicId);
    const exactMatch =
      prisoner?.caseDetails === entry.caseDetails &&
      prisoner.sentencePeriod === entry.sentencePeriod &&
      prisoner.jailType === entry.jailType &&
      prisoner.jailName === entry.jailName &&
      prisoner.createdByOfficerId === officer?.id;

    if (!exactMatch) {
      throw new Error(`Saved Prisoner case verification failed for ${entry.publicId}`);
    }

    return {
      publicId: entry.publicId,
      assignedOfficerPublicId: entry.officerPublicId,
      updated: true,
    };
  });

  console.log(JSON.stringify({ success: true, prisoners: results }, null, 2));
}

main()
  .catch((error) => {
    const message =
      error instanceof Error ? error.message : 'Prisoner case update failed';
    console.error(`[PrisonerCaseUpdate] ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
