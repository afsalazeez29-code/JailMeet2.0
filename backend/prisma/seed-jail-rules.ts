import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

if (process.env.SEED_JAIL_RULES_CONFIRM_PRODUCTION !== 'YES') {
  throw new Error('Set SEED_JAIL_RULES_CONFIRM_PRODUCTION="YES" to seed Jail Rules');
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const rules = [
  ['Visiting hours', 'Attend only during the approved appointment window shown on your visit pass.'],
  ['Required identification', 'Bring a valid government-issued photo identification document.'],
  ['Reporting time', 'Report at least 30 minutes before the appointment for security processing.'],
  ['Security screening', 'All visitors and permitted belongings are subject to security screening.'],
  ['Allowed items', 'Carry only identification and items explicitly approved by facility staff.'],
  ['Prohibited items', 'Weapons, alcohol, controlled substances, and unauthorized recording devices are prohibited.'],
  ['Dress code', 'Wear appropriate clothing suitable for a secure public facility.'],
  ['Mobile-phone policy', 'Keep mobile phones switched off and stored as directed by facility staff.'],
  ['Visitor behaviour', 'Follow staff directions and maintain respectful behaviour throughout the visit.'],
  ['Appointment cancellation', 'Submit cancellation or reschedule requests as early as possible through JailMeet.'],
  ['Emergency instructions', 'In an emergency, remain calm and follow all directions from facility staff.'],
] as const;

const run = async () => {
  const activeCount = await prisma.jailRule.count({ where: { isActive: true } });
  if (activeCount > 0) {
    console.log('Active Jail Rules already exist; no changes made.');
    return;
  }
  await prisma.$transaction(
    rules.map(([title, content], index) => prisma.jailRule.create({
      data: { title, content, category: title, sortOrder: index + 1, isActive: true },
    })),
  );
  console.log(`Created ${rules.length} default Jail Rules.`);
};

run().finally(() => prisma.$disconnect());
