const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.usuario.create({
      data: {
        nome: 'Administrador',
        email: 'admin@museu.com',
        senha: hashedPassword,
        contato: '11999999999',
        role: 'ADMIN',
        created_at: new Date(),
      },
    });
    console.log('✅ Admin criado:', admin.email);
    console.log('🔑 Senha: admin123');
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();