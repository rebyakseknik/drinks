import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hidden test account
  const hashedPassword = await bcrypt.hash('D93akWu$g5', 10);
  await prisma.user.upsert({
    where: { email: 'abacus-2add5a5c@example.com' },
    update: {},
    create: {
      email: 'abacus-2add5a5c@example.com',
      password: hashedPassword,
      name: 'Test Admin',
      role: UserRole.owner,
    },
  });

  // Ensure singleton business settings
  const existing = await prisma.businessSettings.findFirst();
  if (!existing) {
    await prisma.businessSettings.create({
      data: { name: 'Drinks', location: 'Forum Mersin' },
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
