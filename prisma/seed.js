const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@bict.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        nome: 'Administrador BICT',
        senha: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log(`Usuário admin criado com sucesso: ${user.email} / admin123`);
  }

  // 1. Criar Páginas Institucionais
  const paginas = [
    { 
      titulo: 'Home', 
      slug: 'home',
      secoes: [
        {
          tipo: 'BANNER',
          ordem: 0,
          conteudo: JSON.stringify({
            title: "Bem-vindo ao BICT",
            subtitle: "Bacharelado Interdisciplinar em Ciência e Tecnologia",
            buttonText: "Conheça o Curso",
            buttonUrl: "/paginas/sobre-o-bict",
            imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070"
          })
        },
        {
          tipo: 'AVISOS',
          ordem: 1,
          conteudo: JSON.stringify({
            text: "Matrículas abertas para o semestre 2024.1. Verifique seu portal do aluno.",
            type: "info"
          })
        },
        {
          tipo: 'NOTICIAS',
          ordem: 2,
          conteudo: JSON.stringify({
            limit: 3
          })
        }
      ]
    },
    { titulo: 'Sobre o BICT', slug: 'sobre-o-bict' },
    { titulo: 'Corpo Docente', slug: 'corpo-docente' },
    { titulo: 'Coordenação', slug: 'coordenacao' },
    { titulo: 'Documentos e Normas', slug: 'documentos-normas' },
    { titulo: 'Engenharia Aeroespacial', slug: 'engenharia-aeroespacial' },
    { titulo: 'Engenharia Ambiental', slug: 'engenharia-ambiental' },
    { titulo: 'Horários', slug: 'horarios' },
    { titulo: 'Estágio e TCC', slug: 'estagio-tcc' },
  ];

  for (const p of paginas) {
    await prisma.pagina.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        titulo: p.titulo,
        slug: p.slug,
        autorId: user.id,
        publicada: true,
        secoes: p.secoes ? {
          create: p.secoes
        } : {
          create: {
            tipo: 'TEXTO',
            conteudo: `<h2>${p.titulo}</h2><p>Conteúdo em construção...</p>`
          }
        }
      }
    });
  }
  console.log('Páginas institucionais criadas!');

  // 2. Criar Menu Principal
  let menu = await prisma.menu.findUnique({ where: { nome: 'principal' } });
  if (menu) {
    await prisma.menuItem.deleteMany({ where: { menuId: menu.id } }); // Limpa itens antigos
  } else {
    menu = await prisma.menu.create({ data: { nome: 'principal' } });
  }

  // 3. Criar Itens de Menu
  // Item 1: O Curso
  const menuCurso = await prisma.menuItem.create({
    data: { label: 'O Curso', url: '#', ordem: 1, menuId: menu.id }
  });
  await prisma.menuItem.create({ data: { label: 'Sobre o BICT', url: '/paginas/sobre-o-bict', ordem: 1, parentId: menuCurso.id, menuId: menu.id } });
  await prisma.menuItem.create({ data: { label: 'Corpo Docente', url: '/paginas/corpo-docente', ordem: 2, parentId: menuCurso.id, menuId: menu.id } });
  await prisma.menuItem.create({ data: { label: 'Coordenação', url: '/paginas/coordenacao', ordem: 3, parentId: menuCurso.id, menuId: menu.id } });
  await prisma.menuItem.create({ data: { label: 'Documentos e Normas', url: '/paginas/documentos-normas', ordem: 4, parentId: menuCurso.id, menuId: menu.id } });

  // Item 2: Engenharias
  const menuEng = await prisma.menuItem.create({
    data: { label: 'Engenharias', url: '#', ordem: 2, menuId: menu.id }
  });
  await prisma.menuItem.create({ data: { label: 'Engenharia de Computação', url: '/engenharias/computacao', ordem: 1, parentId: menuEng.id, menuId: menu.id } });
  await prisma.menuItem.create({ data: { label: 'Engenharia Aeroespacial', url: '/paginas/engenharia-aeroespacial', ordem: 2, parentId: menuEng.id, menuId: menu.id } });
  await prisma.menuItem.create({ data: { label: 'Engenharia Ambiental', url: '/paginas/engenharia-ambiental', ordem: 3, parentId: menuEng.id, menuId: menu.id } });

  // Item 3: Alunos
  const menuAlunos = await prisma.menuItem.create({
    data: { label: 'Alunos', url: '#', ordem: 3, menuId: menu.id }
  });
  await prisma.menuItem.create({ data: { label: 'Horários e Calendário', url: '/paginas/horarios', ordem: 1, parentId: menuAlunos.id, menuId: menu.id } });
  await prisma.menuItem.create({ data: { label: 'TCC e Estágio', url: '/paginas/estagio-tcc', ordem: 2, parentId: menuAlunos.id, menuId: menu.id } });

  console.log('Menu público criado com sucesso!');

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
