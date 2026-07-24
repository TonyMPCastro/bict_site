const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed completo de dados fictícios para o BICT Site...');

  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. USUÁRIOS
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bict.com' },
    update: { senha: hashedPassword },
    create: {
      email: 'admin@bict.com',
      nome: 'Administrador BICT',
      senha: hashedPassword,
      role: 'ADMIN',
      departamento: 'Coordenação Geral BICT',
      ativo: true
    }
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@bict.com' },
    update: { senha: hashedPassword },
    create: {
      email: 'editor@bict.com',
      nome: 'Maria Silva (Editora)',
      senha: hashedPassword,
      role: 'EDITOR',
      departamento: 'Assessoria de Comunicação',
      ativo: true
    }
  });

  console.log(`✅ Usuários criados: admin@bict.com / ${password}`);

  // 2. PERMISSÕES
  const permissoes = ['GERENCIAR_POSTS', 'GERENCIAR_PAGINAS', 'GERENCIAR_DOCUMENTOS', 'GERENCIAR_CMS'];
  for (const perm of permissoes) {
    await prisma.permissaoUsuario.upsert({
      where: { usuarioId_permissao: { usuarioId: adminUser.id, permissao: perm } },
      update: {},
      create: { usuarioId: adminUser.id, permissao: perm }
    });
  }

  // 3. CATEGORIAS DE NOTÍCIAS & TAGS
  const catGeral = await prisma.categoria.upsert({
    where: { slug: 'geral' },
    update: {},
    create: { nome: 'Geral', slug: 'geral', descricao: 'Notícias gerais da instituição' }
  });

  const catAcademico = await prisma.categoria.upsert({
    where: { slug: 'academico' },
    update: {},
    create: { nome: 'Acadêmico', slug: 'academico', descricao: 'Avisos sobre disciplinas, horários e matrículas' }
  });

  const catEventos = await prisma.categoria.upsert({
    where: { slug: 'eventos' },
    update: {},
    create: { nome: 'Eventos & Simpósios', slug: 'eventos', descricao: 'Eventos científicos e workshops' }
  });

  await prisma.tag.upsert({
    where: { slug: 'sisu' },
    update: {},
    create: { nome: 'SiSU', slug: 'sisu' }
  });

  await prisma.tag.upsert({
    where: { slug: 'tcc' },
    update: {},
    create: { nome: 'TCC & Estágio', slug: 'tcc' }
  });

  // 4. GALERIA DE IMAGENS
  const galeriaCampus = await prisma.galeria.upsert({
    where: { slug: 'campus-laboratorios' },
    update: {},
    create: {
      titulo: 'Infraestrutura dos Laboratórios BICT',
      slug: 'campus-laboratorios',
      descricao: 'Fotos dos nossos laboratórios de informática, robótica e física',
      criadorId: adminUser.id,
      publicada: true,
      imagens: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
            titulo: 'Laboratório de Robótica',
            altText: 'Estudantes desenvolvendo protótipos de robótica'
          },
          {
            url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop',
            titulo: 'Laboratório de Sistemas Embarcados',
            altText: 'Bancada de ensaios eletrônicos'
          }
        ]
      }
    }
  });

  // 5. ENGENHARIAS (HABILITAÇÕES)
  const createEngenhariaLP = (nome, coordenador, bio, foto) => JSON.stringify({
    globalStyles: { fontFamily: 'Inter', primaryColor: '#2563eb', backgroundColor: '#ffffff', textColor: '#0f172a' },
    sections: [
      {
        id: `sec-hero-${nome.toLowerCase().replace(/\s/g, '-')}`,
        title: 'Header Principal',
        visible: true,
        backgroundColor: 'dark',
        padding: '64px 0',
        rows: [
          {
            id: 'r1',
            columns: [
              {
                id: 'c1',
                width: '100%',
                block: {
                  id: 'blk-banner',
                  type: 'banner',
                  props: { title: nome, subtitle: `Conheça a ${nome} do BICT UFMA`, ctaText: 'Ver Matriz Curricular', ctaUrl: '#matriz' }
                }
              }
            ]
          }
        ]
      },
      {
        id: `sec-img-${nome.toLowerCase().replace(/\s/g, '-')}`,
        title: 'Foto e Benefícios',
        visible: true,
        backgroundColor: 'default',
        padding: '64px 0',
        rows: [
          {
            id: 'r2',
            columns: [
              {
                id: 'c2',
                width: '50%',
                block: { id: 'blk-img', type: 'image', props: { imageUrl: foto, altText: `Laboratório de ${nome}` } }
              },
              {
                id: 'c3',
                width: '50%',
                block: { 
                  id: 'blk-ben', 
                  type: 'benefits', 
                  props: { 
                    title: 'Diferenciais do Curso', 
                    subtitle: 'Por que estudar conosco?',
                    benefits: [
                      { title: 'Prática Intensiva', desc: 'Aulas nos melhores laboratórios do estado.', icon: '🧪' },
                      { title: 'Corpo Docente', desc: '100% dos professores são mestres ou doutores.', icon: '🎓' }
                    ]
                  } 
                }
              }
            ]
          }
        ]
      },
      {
        id: `sec-coord-${nome.toLowerCase().replace(/\s/g, '-')}`,
        title: 'Coordenação',
        visible: true,
        backgroundColor: 'muted',
        padding: '64px 0',
        rows: [
          {
            id: 'r3',
            columns: [
              {
                id: 'c4',
                width: '100%',
                block: { id: 'blk-inst', type: 'instructor', props: { name: coordenador, role: `Coordenador(a) de ${nome}`, bio: bio } }
              }
            ]
          }
        ]
      }
    ]
  });

  const engenhariasData = [
    {
      nome: 'Engenharia da Computação',
      slug: 'engenharia-da-computacao',
      descricao: 'Formação focada em desenvolvimento de hardware, software embarcado, arquitetura de computadores e redes.',
      coordenador: 'Prof. Dr. Carlos Eduardo',
      email: 'computacao.bict@ufma.br',
      telefone: '(98) 3272-8001',
      imagem: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
      grade: '8 Semestres após o Ciclo Básico BICT (Total 10 semestres)',
      landingPageEnabled: true,
      landingPageConfig: createEngenhariaLP(
        'Engenharia da Computação', 
        'Prof. Dr. Carlos Eduardo', 
        'Doutor em Inteligência Artificial, especialista em redes neurais profundas.',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop'
      )
    },
    {
      nome: 'Engenharia Elétrica',
      slug: 'engenharia-eletrica',
      descricao: 'Formação técnica avançada em geração e distribuição de energia.',
      coordenador: 'Profª. Dra. Helena Mendes',
      email: 'eletrica.bict@ufma.br',
      telefone: '(98) 3272-8002',
      imagem: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop',
      grade: '8 Semestres após o Ciclo Básico BICT',
      landingPageEnabled: true,
      landingPageConfig: createEngenhariaLP(
        'Engenharia Elétrica', 
        'Profª. Dra. Helena Mendes', 
        'Doutora em Sistemas de Potência, com foco em energias renováveis e smart grids.',
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop'
      )
    },
    {
      nome: 'Engenharia Mecânica',
      slug: 'engenharia-mecanica',
      descricao: 'Projeto de máquinas, mecânica dos fluidos, termodinâmica.',
      coordenador: 'Prof. Dr. Roberto Fonseca',
      email: 'mecanica.bict@ufma.br',
      telefone: '(98) 3272-8003',
      imagem: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=1000&auto=format&fit=crop',
      grade: '8 Semestres após o Ciclo Básico BICT',
      landingPageEnabled: true,
      landingPageConfig: createEngenhariaLP(
        'Engenharia Mecânica', 
        'Prof. Dr. Roberto Fonseca', 
        'Doutor em Termodinâmica e processos de fabricação automatizada.',
        'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=1000&auto=format&fit=crop'
      )
    }
  ];

  for (const eng of engenhariasData) {
    await prisma.engenharia.upsert({
      where: { slug: eng.slug },
      update: { landingPageConfig: eng.landingPageConfig, landingPageEnabled: eng.landingPageEnabled },
      create: { ...eng, publicada: true }
    });
  }

  // 6. POSTS / NOTÍCIAS
  const postsData = [
    {
      titulo: 'Abertas as Inscrições para Seleção de Monitoria 2026.2',
      slug: 'inscricoes-abertas-monitoria-2026-2',
      resumo: 'Alunos do BICT podem se inscrever para monitoria remunerada e voluntária nas disciplinas do ciclo básico.',
      conteudo: '<p>A coordenação do Bacharelado Interdisciplinar em Ciência e Tecnologia divulga o edital oficial de monitoria para o semestre 2026.2. As inscrições começam no dia 1º de Agosto e seguem até o dia 10 de Agosto.</p><p>Estão disponíveis bolsas para as disciplinas de Cálculo I, Física Geral e Algoritmos.</p>',
      imagem: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
      autorId: adminUser.id,
      categoriaId: catAcademico.id,
      publicado: true,
      destaque: true,
      dataPublicacao: new Date()
    },
    {
      titulo: 'Simpósio de Ciência e Tecnologia 2026 Reúne Pesquisadores',
      slug: 'simposio-ciencia-tecnologia-2026',
      resumo: 'Evento anual do BICT contará com palestras de convidados internacionais e apresentação de trabalhos acadêmicos.',
      conteudo: '<p>O Simpósio Interdisciplinar de Ciência e Tecnologia será realizado entre os dias 20 e 22 de Outubro no auditório central. Inscreva seus resumos até o final do mês.</p>',
      imagem: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000&auto=format&fit=crop',
      autorId: editorUser.id,
      categoriaId: catEventos.id,
      publicado: true,
      destaque: true,
      dataPublicacao: new Date()
    }
  ];

  for (const p of postsData) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: p
    });
  }

  // 7. CATEGORIAS DE DOCUMENTOS & DOCUMENTOS
  const catDocRegimento = await prisma.categoriaDoc.upsert({
    where: { slug: 'regimentos-e-normas' },
    update: {},
    create: { nome: 'Regimentos e Normas', slug: 'regimentos-e-normas', descricao: 'Documentos normativos do BICT' }
  });

  const docsData = [
    {
      titulo: 'Regimento Interno do BICT 2026',
      descricao: 'Normamento completo referente ao ciclo básico e transição para engenharias.',
      arquivo: '/docs/regimento-bict-2026.pdf',
      tipoArquivo: 'pdf',
      tamanho: 2450000,
      categoriaId: catDocRegimento.id,
      uploaderId: adminUser.id,
      publico: true
    },
    {
      titulo: 'Formulário de Requerimento Geral',
      descricao: 'Formulário padrão para solicitação de segunda chamada e trancamento de matrícula.',
      arquivo: '/docs/requerimento-geral.docx',
      tipoArquivo: 'docx',
      tamanho: 154000,
      categoriaId: catDocRegimento.id,
      uploaderId: adminUser.id,
      publico: true
    }
  ];

  for (const doc of docsData) {
    await prisma.documento.create({ data: doc });
  }

  // 8. CONFIGURAÇÕES DO CMS WHITE LABEL & CONSTRUTORA POR BLOCOS
  const defaultHeaderJSON = JSON.stringify({
    layout: 'standard',
    sticky: true,
    showSearch: true,
    primaryColor: '#2563eb',
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    links: [
      { id: '1', label: 'Início', url: '/' },
      { id: '2', label: 'Engenharias', url: '/engenharias' },
      { id: '3', label: 'Notícias', url: '/noticias' },
      { id: '4', label: 'Documentos', url: '/documentos' },
      { id: '5', label: 'Contato', url: '/contato' }
    ]
  });

  const defaultFooterJSON = JSON.stringify({
    layout: 'standard',
    primaryColor: '#1e293b',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    copyrightText: '© BICT - Bacharelado Interdisciplinar em Ciência e Tecnologia. Todos os direitos reservados.',
    colunas: [
      {
        id: 'c1',
        titulo: 'Navegação Principal',
        links: [
          { id: '1', label: 'Início', url: '/' },
          { id: '2', label: 'Engenharias', url: '/engenharias' },
          { id: '3', label: 'Notícias', url: '/noticias' }
        ]
      },
      {
        id: 'c2',
        titulo: 'Institucional',
        links: [
          { id: '4', label: 'Documentos e Normas', url: '/documentos' },
          { id: '5', label: 'Portal do Aluno', url: '/login' }
        ]
      }
    ]
  });

  const defaultLoginJSON = JSON.stringify({
    layout: 'split-left',
    backgroundImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop',
    overlayOpacity: 0.6,
    panelWidth: '460px',
    instructionText: 'Use seu CPF ou Matrícula institucional e sua senha para acessar o painel BICT.',
    titulo: 'Portal Acadêmico BICT',
    subtitulo: 'Acesso restrito para discentes e docentes'
  });

  const defaultSocialJSON = JSON.stringify([
    { id: 's1', platform: 'instagram', url: 'https://instagram.com/bict_ufma', enabled: true },
    { id: 's2', platform: 'facebook', url: 'https://facebook.com/bict', enabled: true },
    { id: 's3', platform: 'youtube', url: 'https://youtube.com', enabled: true },
    { id: 's4', platform: 'linkedin', url: 'https://linkedin.com', enabled: true },
    { id: 's5', platform: 'whatsapp', url: 'https://wa.me/5598988888888', enabled: true }
  ]);

  const defaultWhatsAppJSON = JSON.stringify({
    enabled: true,
    phoneNumber: '5598988888888',
    defaultMessage: 'Olá! Gostaria de mais informações sobre o BICT.',
    attendantName: 'Atendimento BICT',
    welcomeMessage: 'Olá! Como podemos ajudar você hoje? Fale diretamente com nossa coordenação.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    position: 'bottom-right',
    pulseAnimation: true
  });

  const defaultHomeLandingJSON = JSON.stringify({
    globalStyles: {
      fontFamily: 'Inter',
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      buttonVariant: 'glow'
    },
    sections: [
      {
        id: 'sec-hero-1',
        title: 'Hero Principal',
        visible: true,
        backgroundColor: 'transparent',
        padding: '80px 0',
        rows: [
          {
            id: 'row-hero-1',
            columns: [
              {
                id: 'col-hero-1',
                width: '100%',
                block: {
                  id: 'blk-hero-1',
                  type: 'hero',
                  props: {
                    title: 'Bacharelado Interdisciplinar em Ciência e Tecnologia',
                    subtitle: 'Formação superior inovadora, humanística e tecnológica com acesso direto às principais Engenharias.',
                    ctaText: 'Conheça as Engenharias',
                    ctaUrl: '/engenharias',
                    secondaryCtaText: 'Dúvidas no WhatsApp',
                    secondaryCtaUrl: 'https://wa.me/5598988888888',
                    effect: 'spotlight'
                  }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'sec-eng-catalog',
        title: 'Vitrine de Engenharias',
        visible: true,
        backgroundColor: 'muted',
        padding: '64px 0',
        rows: [
          {
            id: 'row-eng-1',
            columns: [
              {
                id: 'col-eng-1',
                width: '100%',
                block: {
                  id: 'blk-eng-1',
                  type: 'engineering-catalog',
                  props: {
                    title: 'Nossas Habilitações em Engenharia',
                    subtitle: 'Após 3 anos de ciclo básico no BICT, continue a sua trajetória profissional'
                  }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'sec-news-1',
        title: 'Notícias em Bento Grid',
        visible: true,
        backgroundColor: 'transparent',
        padding: '64px 0',
        rows: [
          {
            id: 'row-news-1',
            columns: [
              {
                id: 'col-news-1',
                width: '100%',
                block: {
                  id: 'blk-news-1',
                  type: 'news-grid',
                  props: {
                    title: 'Últimas Notícias e Comunicados',
                    subtitle: 'Acompanhe as principais novidades acadêmicas do bacharelado'
                  }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'sec-wa-cta-1',
        title: 'Atendimento WhatsApp',
        visible: true,
        backgroundColor: 'primary',
        padding: '64px 0',
        rows: [
          {
            id: 'row-wa-1',
            columns: [
              {
                id: 'col-wa-1',
                width: '100%',
                block: {
                  id: 'blk-wa-1',
                  type: 'whatsapp-cta',
                  props: {
                    title: 'Dúvidas sobre o BICT ou Ingresso SiSU?',
                    subtitle: 'Fale com a coordenação acadêmica diretamente pelo WhatsApp.',
                    buttonText: 'Chamar no WhatsApp Agora',
                    phoneNumber: '5598988888888'
                  }
                }
              }
            ]
          }
        ]
      },
      {
        id: 'sec-faq-1',
        title: 'Perguntas Frequentes',
        visible: true,
        backgroundColor: 'transparent',
        padding: '64px 0',
        rows: [
          {
            id: 'row-faq-1',
            columns: [
              {
                id: 'col-faq-1',
                width: '100%',
                block: {
                  id: 'blk-faq-1',
                  type: 'faq',
                  props: {
                    title: 'Perguntas Frequentes',
                    subtitle: 'Respostas para as dúvidas mais comuns dos alunos e ingressantes'
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  });

  const configsData = [
    { chave: 'cor_primaria', valor: '#2563eb' },
    { chave: 'nome_site', valor: 'BACHARELADO INTERDISCIPLINAR EM CIÊNCIA E TECNOLOGIA' },
    { chave: 'logo_url', valor: '/cropped-bict-azul-1.png' },
    { chave: 'header_config', valor: defaultHeaderJSON },
    { chave: 'footer_config', valor: defaultFooterJSON },
    { chave: 'login_config', valor: defaultLoginJSON },
    { chave: 'social_links_config', valor: defaultSocialJSON },
    { chave: 'whatsapp_config', valor: defaultWhatsAppJSON },
    { chave: 'home_landing_config', valor: defaultHomeLandingJSON }
  ];

  for (const c of configsData) {
    await prisma.configuracao.upsert({
      where: { chave: c.chave },
      update: { valor: c.valor },
      create: c
    });
  }

  // 9. PÁGINA HOME COM LANDING PAGE CONFIG
  await prisma.pagina.upsert({
    where: { slug: 'home' },
    update: { landingPageConfig: defaultHomeLandingJSON },
    create: {
      titulo: 'Página Inicial BICT',
      slug: 'home',
      descricao: 'Página inicial com landing page por blocos modulares.',
      autorId: adminUser.id,
      publicada: true,
      landingPageConfig: defaultHomeLandingJSON,
      seo: {
        create: {
          metaDesc: 'Bacharelado Interdisciplinar em Ciência e Tecnologia da UFMA.',
          keywords: 'BICT, UFMA, Engenharia, Ciência, Tecnologia, SiSU'
        }
      }
    }
  });

  // 10. MENU PRINCIPAL
  let menu = await prisma.menu.findUnique({ where: { nome: 'principal' } });
  if (menu) {
    await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });
  } else {
    menu = await prisma.menu.create({ data: { nome: 'principal' } });
  }

  const mCurso = await prisma.menuItem.create({ data: { label: 'O Curso', url: '/', ordem: 1, menuId: menu.id } });
  await prisma.menuItem.create({ data: { label: 'Sobre o BICT', url: '/noticias', ordem: 1, parentId: mCurso.id, menuId: menu.id } });

  const mEng = await prisma.menuItem.create({ data: { label: 'Engenharias', url: '/engenharias', ordem: 2, menuId: menu.id } });
  await prisma.menuItem.create({ data: { label: 'Engenharia de Computação', url: '/engenharias#engenharia-da-computacao', ordem: 1, parentId: mEng.id, menuId: menu.id } });
  await prisma.menuItem.create({ data: { label: 'Engenharia Elétrica', url: '/engenharias#engenharia-eletrica', ordem: 2, parentId: mEng.id, menuId: menu.id } });

  console.log('✅ Seed finalizado com sucesso! Todos os dados fictícios foram populados no banco de dados.');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução do seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
