const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@bict.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('Usuário admin já existe!');
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      nome: 'Administrador BICT',
      senha: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`Usuário admin criado com sucesso: ${user.email} / admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
