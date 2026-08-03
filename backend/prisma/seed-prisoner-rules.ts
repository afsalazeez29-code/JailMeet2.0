import 'dotenv/config';
import { JailRuleAudience, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

if (process.env.SEED_PRISONER_RULES_CONFIRM_PRODUCTION !== 'YES') {
  throw new Error('Production confirmation is required to seed Prisoner rules');
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const rules = [
  ['Daily routine', 'Follow the published daily schedule and all directions provided by authorized facility staff.'],
  ['Cell and accommodation rules', 'Keep assigned accommodation orderly and report maintenance or safety concerns through authorized channels.'],
  ['Visitor procedures', 'Attend approved visits at the scheduled time and follow all security and conduct instructions.'],
  ['Parole request instructions', 'Submit complete and accurate parole information and monitor JailMeet for the Officer decision.'],
  ['Behaviour and discipline', 'Treat staff and other Prisoners respectfully and comply with lawful facility instructions.'],
  ['Allowed items', 'Keep only items approved by the facility and assigned through authorized procedures.'],
  ['Prohibited items', 'Weapons, controlled substances, unauthorized electronics, and other prohibited property are not permitted.'],
  ['Medical request procedure', 'Use the approved support or facility process to request non-emergency medical assistance.'],
  ['Legal-aid request procedure', 'Use the approved support or facility process to request access to available legal assistance.'],
  ['Emergency procedure', 'Remain calm during emergencies and follow all directions from facility staff.'],
  ['Complaint and grievance procedure', 'Submit concerns factually through the JailMeet Support / Grievance workflow or another authorized channel.'],
  ['Security instructions', 'Do not interfere with security equipment, restricted areas, searches, or verification procedures.'],
] as const;

const run = async () => {
  const existing = await prisma.jailRule.findMany({
    where: {
      audience: JailRuleAudience.PRISONER,
      title: { in: rules.map(([title]) => title) },
    },
    select: { title: true },
  });
  const existingTitles = new Set(existing.map(({ title }) => title));
  const missingRules = rules.filter(([title]) => !existingTitles.has(title));
  if (missingRules.length === 0) {
    console.log('Default Prisoner rules already exist; no changes made.');
    return;
  }

  await prisma.$transaction(
    missingRules.map(([title, content]) => prisma.jailRule.create({
      data: {
        reference: `RUL-PRN-${String(rules.findIndex(([knownTitle]) => knownTitle === title) + 1).padStart(3, '0')}`,
        title,
        content,
        category: title,
        audience: JailRuleAudience.PRISONER,
        sortOrder: rules.findIndex(([knownTitle]) => knownTitle === title) + 1,
        isActive: true,
      },
    })),
  );
  console.log(`Created ${missingRules.length} missing default Prisoner rules.`);
};

run().finally(() => prisma.$disconnect());
