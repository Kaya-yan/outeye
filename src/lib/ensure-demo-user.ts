import { prisma } from './prisma';

const DEMO_USER_ID = 'demo-user';

export async function ensureDemoUser() {
  await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: {
      id: DEMO_USER_ID,
      name: '演示用户',
      email: 'demo@outeye.app',
    },
  });
}
