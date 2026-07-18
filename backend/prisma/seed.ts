/**
 * seed.ts - Database seeder for JailMeet 2.0
 *
 * Run with: npm run seed
 *
 * This seed creates default test users for each role so auth and RBAC
 * flows can be verified after migration.
 */

import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@jailmeet.com' },
    update: {},
    create: {
      email: 'admin@jailmeet.com',
      password: hashedPassword,
      role: Role.ADMIN,
      adminProfile: {
        create: {
          name: 'System Admin',
        },
      },
    },
  });

  await prisma.adminProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      name: 'System Admin',
    },
  });

  console.log(`Admin user seeded: ${admin.email}`);

  const officerPassword = await bcrypt.hash('officer123', 12);

  const officer = await prisma.user.upsert({
    where: { email: 'officer@jailmeet.com' },
    update: {
      password: officerPassword,
      role: Role.OFFICER,
      isActive: true,
    },
    create: {
      email: 'officer@jailmeet.com',
      password: officerPassword,
      role: Role.OFFICER,
      officerProfile: {
        create: {
          name: 'Test Officer',
          phone: '9999990001',
        },
      },
    },
  });

  await prisma.officerProfile.upsert({
    where: { userId: officer.id },
    update: {},
    create: {
      userId: officer.id,
      name: 'Test Officer',
      phone: '9999990001',
    },
  });

  console.log(`Officer user seeded: ${officer.email}`);

  const visitorPassword = await bcrypt.hash('visitor123', 12);

  const visitor = await prisma.user.upsert({
    where: { email: 'visitor@jailmeet.com' },
    update: {
      password: visitorPassword,
      role: Role.VISITOR,
      isActive: true,
    },
    create: {
      email: 'visitor@jailmeet.com',
      password: visitorPassword,
      role: Role.VISITOR,
      visitorProfile: {
        create: {
          name: 'Test Visitor',
          phone: '9999990002',
          state: 'Test State',
          address: '123 Test Visitor Street',
          zip: '000001',
        },
      },
    },
  });

  await prisma.visitorProfile.upsert({
    where: { userId: visitor.id },
    update: {},
    create: {
      userId: visitor.id,
      name: 'Test Visitor',
      phone: '9999990002',
      state: 'Test State',
      address: '123 Test Visitor Street',
      zip: '000001',
    },
  });

  console.log(`Visitor user seeded: ${visitor.email}`);

  const prisonerPassword = await bcrypt.hash('prisoner123', 12);

  const prisoner = await prisma.user.upsert({
    where: { email: 'prisoner@jailmeet.com' },
    update: {
      password: prisonerPassword,
      role: Role.PRISONER,
      isActive: true,
    },
    create: {
      email: 'prisoner@jailmeet.com',
      password: prisonerPassword,
      role: Role.PRISONER,
      prisonerProfile: {
        create: {
          name: 'Test Prisoner',
          age: 35,
          gender: 'Male',
          admissionDate: new Date('2026-01-01T00:00:00.000Z'),
          caseDetails: 'Test case details',
          sentencePeriod: '1 year',
          jailType: 'Central Jail',
          jailName: 'Test Jail',
          cellNumber: 'A-101',
        },
      },
    },
  });

  await prisma.prisonerProfile.upsert({
    where: { userId: prisoner.id },
    update: {},
    create: {
      userId: prisoner.id,
      name: 'Test Prisoner',
      age: 35,
      gender: 'Male',
      admissionDate: new Date('2026-01-01T00:00:00.000Z'),
      caseDetails: 'Test case details',
      sentencePeriod: '1 year',
      jailType: 'Central Jail',
      jailName: 'Test Jail',
      cellNumber: 'A-101',
    },
  });

  console.log(`Prisoner user seeded: ${prisoner.email}`);
  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
