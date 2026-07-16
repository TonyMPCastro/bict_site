const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const noticias = [
  { titulo: 'BICT recebe visita de representantes de empresas parceiras', slug: 'bict-recebe-visita-de-representantes-de-empresas-parceiras', conteudo: '<p>O curso realizou uma semana de encontros com empresas parceiras para fortalecer projetos de extensão e estágio.</p>', resumo: 'Semana de encontros reuniu empresas e estudantes.', publicado: true, dataPublicacao: new Date('2026-07-01T10:00:00.000Z') },
  { titulo: 'Estudantes apresentam protótipos no seminário de inovação', slug: 'estudantes-apresentam-prototipos-no-seminario-de-inovacao', conteudo: '<p>Os projetos desenvolvidos pelos alunos foram apresentados para a comunidade acadêmica e convidados externos.</p>', resumo: 'Protótipos foram exibidos em evento interno.', publicado: true, dataPublicacao: new Date('2026-06-28T15:30:00.000Z') },
  { titulo: 'Nova sala de laboratórios foi inaugurada no campus', slug: 'nova-sala-de-laboratorios-foi-inaugurada-no-campus', conteudo: '<p>A nova estrutura recebeu equipamentos modernos para atividades práticas de engenharia e computação.</p>', resumo: 'Infraestrutura recebeu melhorias importantes.', publicado: true, dataPublicacao: new Date('2026-06-20T09:00:00.000Z') },
  { titulo: 'Alunos conquistam prêmio em competição regional', slug: 'alunos-conquistam-premio-em-competicao-regional', conteudo: '<p>A equipe do BICT venceu a etapa regional de uma competição de inovação tecnológica.</p>', resumo: 'Equipe destacou-se por projeto inovador.', publicado: true, dataPublicacao: new Date('2026-06-15T12:00:00.000Z') },
  { titulo: 'Programa de mentoria começa para calouros', slug: 'programa-de-mentoria-comeca-para-calouros', conteudo: '<p>Professores e estudantes mais avançados passaram a acompanhar o desenvolvimento dos ingressantes.</p>', resumo: 'Acompanhamento de calouros ganhou força.', publicado: true, dataPublicacao: new Date('2026-06-10T08:00:00.000Z') },
  { titulo: 'BICT participa de feira de ciência e tecnologia', slug: 'bict-participa-de-feira-de-ciencia-e-tecnologia', conteudo: '<p>O curso abriu espaço para demonstrações de pesquisas e projetos voltados à sociedade.</p>', resumo: 'Evento reuniu pesquisadores e visitantes.', publicado: true, dataPublicacao: new Date('2026-06-05T14:00:00.000Z') },
  { titulo: 'Curso amplia oferta de vagas para monitoria', slug: 'curso-amplia-oferta-de-vagas-para-monitoria', conteudo: '<p>Novas oportunidades foram abertas para estudantes que desejam apoiar disciplinas e laboratórios.</p>', resumo: 'Monitoria ganhou novas vagas.', publicado: true, dataPublicacao: new Date('2026-05-30T11:30:00.000Z') },
  { titulo: 'Docentes participam de capacitação em IA', slug: 'docentes-participam-de-capacitacao-em-ia', conteudo: '<p>Professores participaram de formação para integrar inteligência artificial em atividades acadêmicas.</p>', resumo: 'Capacitação reforça formação docente.', publicado: true, dataPublicacao: new Date('2026-05-25T16:00:00.000Z') },
  { titulo: 'Estudantes visitam empresas do setor aeroespacial', slug: 'estudantes-visitam-empresas-do-setor-aeroespacial', conteudo: '<p>Uma viagem técnica aproximou os alunos da realidade do mercado e de projetos inovadores.</p>', resumo: 'Visita técnica fortaleceu a formação prática.', publicado: true, dataPublicacao: new Date('2026-05-20T10:45:00.000Z') },
  { titulo: 'BICT lança novo portal de acesso para alunos', slug: 'bict-lanca-novo-portal-de-acesso-para-alunos', conteudo: '<p>O novo ambiente digital foi lançado para centralizar informações acadêmicas e serviços importantes.</p>', resumo: 'Portal digital melhora acesso aos serviços.', publicado: true, dataPublicacao: new Date('2026-05-15T09:15:00.000Z') }
];

async function main() {
  // Garantir autor para associar aos posts
  let autor = await prisma.user.findUnique({ where: { email: 'admin@bict.com' } });
  if (!autor) {
    autor = await prisma.user.findFirst();
  }
  if (!autor) {
    autor = await prisma.user.create({ data: { email: 'seed@bict.local', nome: 'Seed User', senha: 'seed' } });
    console.log('Usuário seed criado para autoria das notícias.');
  }

  let categoria = await prisma.categoria.findUnique({ where: { slug: 'geral' } });
  if (!categoria) {
    categoria = await prisma.categoria.create({ data: { nome: 'Geral', slug: 'geral', descricao: 'Notícias gerais do BICT' } });
    console.log('Categoria "Geral" criada.');
  }

  for (const n of noticias) {
    await prisma.post.upsert({
      where: { slug: n.slug },
      update: {
        titulo: n.titulo,
        conteudo: n.conteudo,
        resumo: n.resumo,
        publicado: n.publicado,
        dataPublicacao: n.dataPublicacao,
        categoriaId: categoria.id,
        autorId: autor.id,
      },
      create: {
        titulo: n.titulo,
        slug: n.slug,
        conteudo: n.conteudo,
        resumo: n.resumo,
        publicado: n.publicado,
        dataPublicacao: n.dataPublicacao,
        categoriaId: categoria.id,
        autorId: autor.id,
      }
    });
  }

  const count = await prisma.post.count({ where: { publicado: true } });
  console.log(`Seed concluída: ${count} posts publicados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
