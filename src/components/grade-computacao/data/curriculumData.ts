// ============================================================
// Dados Curriculares - BICT UFMA (Matriz 2022)
// 4 ênfases: NT1 Civil | NT2 Mecânica | NT3 Ambiental | NT4 Computação
// ============================================================

// ---- TIPO DE CONFIGURAÇÃO DE CORES / LABELS ----
export const typeConfig = {
  bict_mandatory: { label: "Obrigatória BICT", bg: "bg-amber-100/70", text: "text-amber-900", border: "border-amber-400" },
  bict_elective: { label: "Optativa BICT", bg: "bg-blue-100/70", text: "text-blue-900", border: "border-blue-400" },
  eng_specific: { label: "Específica da Engenharia", bg: "bg-emerald-100/70", text: "text-emerald-900", border: "border-emerald-400" },
  complementary: { label: "Ativ. Complementares / TCC", bg: "bg-rose-100/70", text: "text-rose-900", border: "border-rose-400" },
  second_cycle_placeholder: { label: "2º Ciclo (a cadastrar)", bg: "bg-slate-100/70", text: "text-slate-500", border: "border-dashed border-slate-300" },
};

// ============================================================
// NT4 - ENGENHARIA DE COMPUTAÇÃO (BICT 6 níveis + 2º ciclo completo)
// ============================================================
const computacaoData = {
  id: "computacao",
  name: "Engenharia de Computação",
  shortName: "Eng. Computação",
  code: "NT4",
  color: "emerald",
  description: "Hardware, Software e Sistemas Inteligentes",
  icon: "monitor",
  gradient: "from-emerald-600 to-teal-700",
  accentColor: "#10b981",
  semestersNoturno: [
    {
      semester: 1, phase: "bict", totalHours: 300,
      courses: [
        { name: "Química Geral e Inorgânica",        code: "CCCT0004", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Ciência, Tecnologia e Sociedade",   code: "CCCT0007", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Meio Ambiente e Sustentabilidade",  code: "CCCT0012", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Cálculo Diferencial",               code: "CCCT0091", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Práticas de Leitura e Escrita",      code: "CCCT0092", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Vetores e Geometria Analítica",     code: "CCCT0093", hours: 60, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 2, phase: "bict", totalHours: 300,
      courses: [
        { name: "Metodologia da Pesquisa Científica", code: "CCCT0003", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Química Experimental",               code: "CCCT0005", hours: 30, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Fundamentos de Computação",          code: "CCCT0006", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Fenômenos Mecânicos",                code: "CCCT0011", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Álgebra Linear",                    code: "CCCT0095", hours: 60, type: "bict_mandatory", req: ["CCCT0093"] },
        { name: "Cálculo Integral",                   code: "CCCT0096", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
      ]
    },
    {
      semester: 3, phase: "bict", totalHours: 390,
      courses: [
        { name: "Desenho Computacional",                     code: "CCCT0002", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Fundamentos de Segurança no Trabalho",      code: "CCCT0027", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Administração e Economia",                  code: "CCCT0094", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Oscilações, Ondas e Óptica",                               code: "CCCT0098", hours: 60, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Introdução à Probabilidade e Estatística", code: "CCCT0097", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Funções de Várias Variáveis",              code: "CCCT0128", hours: 90, type: "bict_mandatory", req: ["CCCT0096", "CCCT0095"] },
        { name: "Física Experimental I",                                     code: "CCCT0017", hours: 30, type: "bict_mandatory", req: ["CCCT0011"] },

      ]
    },
    {
      semester: 4, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fundamentos de Química Orgânica e Biotecnologia",           code: "CCCT0021", hours: 60, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Equações Diferenciais Ordinárias I",                        code: "CCCT0099", hours: 60, type: "bict_mandatory", req: ["CCCT0128"] },
        { name: "Físico-Química Fundamental",                                 code: "CCCT0020", hours: 30, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Fenômenos Eletromagnéticos",                                code: "CCCT0018", hours: 60, type: "bict_mandatory", req: ["CCCT0098"] },
        { name: "Cálculo Numérico",                                           code: "CCCT0022", hours: 60, type: "bict_mandatory", req: ["CCCT0096"] },
        { name: "Física Experimental II",                                     code: "CCCT0025", hours: 30, type: "bict_mandatory", req: ["CCCT0017"] },
      ]
    },
    {
      semester: 5, phase: "bict", totalHours: 360,
      courses: [
        { name: "Ciência e Tecnologia dos Materiais",                         code: "CCCT0019", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Mecânica dos Fluídos",                                       code: "CCCT0023", hours: 60, type: "bict_elective",  req: ["CCCT0011"] },
        { name: "Mecânica dos Sólidos",                                       code: "CCCT0024", hours: 60, type: "bict_elective",  req: ["CCCT0011"] },
        { name: "Eletricidade Aplicada",                                      code: "CCCT0026", hours: 60, type: "bict_elective",  req: ["CCCT0018"] },
        { name: "Algoritmos e Estrutura de Dados I",                          code: "CCCT0103", hours: 60, type: "bict_elective",  req: ["CCCT0006"] },
      ]
    },
    {
      semester: 6, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "Eletrônica Aplicada",       code: "EECP0001", hours: 60, type: "eng_specific", req: ["CCCT0026"] },
        { name: "Circuitos Digitais",        code: "EECP0002", hours: 60, type: "eng_specific", req: [] },
        { name: "Engenharia de Software",    code: "EECP0003", hours: 60, type: "eng_specific", req: ["CCCT0103"] },
        { name: "Banco de Dados",            code: "EECP0004", hours: 90, type: "eng_specific", req: ["CCCT0103"] },
        { name: "Paradigmas de Programação", code: "EECP0005", hours: 90, type: "eng_specific", req: ["CCCT0103"] },
      ]
    },
    {
      semester: 7, phase: "second_cycle", totalHours: 510,
      courses: [
        { name: "Laboratório de Eletrônica Aplicada",    code: "EECP0006", hours: 60, type: "eng_specific",  req: ["EECP0001"] },
        { name: "Laboratório de Circuitos Digitais",     code: "EECP0007", hours: 60, type: "eng_specific",  req: ["EECP0002"] },
        { name: "Inteligência Artificial",               code: "EECP0008", hours: 60, type: "eng_specific",  req: ["CCCT0103"] },
        { name: "Arquitetura de Computadores",           code: "EECP0009", hours: 60, type: "eng_specific",  req: ["EECP0002"] },
        { name: "Sistemas Operacionais",                 code: "EECP0010", hours: 60, type: "eng_specific",  req: ["CCCT0103"] },
        { name: "Projeto e Desenvolvimento de Software", code: "EECP0011", hours: 60, type: "eng_specific",  req: ["EECP0003"] },
        { name: "Atividades Complementares BICT",        code: "CCCT0089", hours: 90, type: "complementary", req: [] },
        { name: "Trabalho de Conclusão de Curso BICT",   code: "CCCT0100", hours: 60, type: "complementary", req: [] },
      ]
    },
    {
      semester: 8, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "Instrumentação",                               code: "EECP0012", hours: 60, type: "eng_specific", req: ["EECP0006"] },
        { name: "Análise de Sistemas Lineares",                 code: "EECP0013", hours: 90, type: "eng_specific", req: ["CCCT0128"] },
        { name: "Computação Gráfica",                           code: "EECP0014", hours: 60, type: "eng_specific", req: ["EECP0005"] },
        { name: "Lógica e Matemática Discreta",                 code: "EECP0015", hours: 60, type: "eng_specific", req: [] },
        { name: "Comunicação de Dados e Redes de Computadores", code: "EECP0016", hours: 90, type: "eng_specific", req: ["EECP0010"] },
      ]
    },
    {
      semester: 9, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "Engenharia de Controle",          code: "EECP0017", hours: 90, type: "eng_specific", req: ["EECP0012", "EECP0013"] },
        { name: "Processamento Digital de Sinais", code: "EECP0018", hours: 90, type: "eng_specific", req: ["EECP0013"] },
        { name: "Métodos Formais",                 code: "EECP0019", hours: 60, type: "eng_specific", req: ["EECP0015"] },
        { name: "Linguagens Formais e Autômatos",  code: "EECP0020", hours: 60, type: "eng_specific", req: ["EECP0015"] },
        { name: "Sistemas Distribuídos",           code: "EECP0021", hours: 60, type: "eng_specific", req: ["EECP0016"] },
      ]
    },
    {
      semester: 10, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "Automação Industrial",             code: "EECP0022", hours: 90, type: "eng_specific", req: ["EECP0017"] },
        { name: "Sistemas Embarcados",              code: "EECP0023", hours: 60, type: "eng_specific", req: ["EECP0009"] },
        { name: "Processamento de Imagens",         code: "EECP0024", hours: 60, type: "eng_specific", req: ["EECP0018"] },
        { name: "Sistemas de Tempo Real",           code: "EECP0025", hours: 60, type: "eng_specific", req: ["EECP0021"] },
        { name: "Compiladores",                     code: "EECP0026", hours: 60, type: "eng_specific", req: ["EECP0020"] },
        { name: "Trabalho de Conclusão de Curso I", code: "EECP0027", hours: 30, type: "complementary", req: [] },
      ]
    },
    {
      semester: 11, phase: "second_cycle", totalHours: 250,
      courses: [
        { name: "Estágio Supervisionado",            code: "EECP0028", hours: 160, type: "complementary", req: [] },
        { name: "Atividades Complementares",         code: "EECP0029", hours: 60,  type: "complementary", req: [] },
        { name: "Trabalho de Conclusão de Curso II", code: "EECP0030", hours: 30,  type: "complementary", req: ["EECP0027"] },
        { name: "Disciplinas Optativas",             code: "OPT_COMP", hours: 180, type: "eng_specific",  req: [] },
      ]
    },
  ],
  semestersDiurno: [
    {
      semester: 1, phase: "bict", totalHours: 390,
      courses: [
        { name: "Cálculo Diferencial e Geometria Analítica", code: "CCCT0001", hours: 90, type: "bict_mandatory", req: [] },
        { name: "Desenho Computacional",                     code: "CCCT0002", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Metodologia da Pesquisa Científica",        code: "CCCT0003", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Química Geral e Inorgânica",                code: "CCCT0004", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Química Experimental",                      code: "CCCT0005", hours: 30, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Fundamentos de Computação",                 code: "CCCT0006", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Ciência, Tecnologia e Sociedade",           code: "CCCT0007", hours: 60, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 2, phase: "bict", totalHours: 390,
      courses: [
        { name: "Cálculo Integral",                  code: "CCCT0008", hours: 90, type: "bict_mandatory", req: ["CCCT0001"] },
        { name: "Estatística e Probabilidade",       code: "CCCT0009", hours: 60, type: "bict_mandatory", req: ["CCCT0001"] },
        { name: "Álgebra Linear Aplicada",           code: "CCCT0010", hours: 60, type: "bict_mandatory", req: ["CCCT0001"] },
        { name: "Fenômenos Mecânicos",               code: "CCCT0011", hours: 60, type: "bict_mandatory", req: ["CCCT0001"] },
        { name: "Meio Ambiente e Sustentabilidade",  code: "CCCT0012", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Algoritmos e Estrutura de Dados",   code: "CCCT0013", hours: 60, type: "bict_mandatory", req: ["CCCT0006"] },
        { name: "Leitura e Produção Textual",        code: "CCCT0014", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 3, phase: "bict", totalHours: 390,
      courses: [
        { name: "Funções de Várias Variáveis",                     code: "CCCT0015", hours: 90, type: "bict_mandatory", req: ["CCCT0008", "CCCT0010"] },
        { name: "Administração",                                   code: "CCCT0016", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Física Experimental I",                           code: "CCCT0017", hours: 30, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Fenômenos Eletromagnéticos",                      code: "CCCT0018", hours: 60, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Ciência e Tecnologia dos Materiais",              code: "CCCT0019", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Físico-Química Fundamental",                      code: "CCCT0020", hours: 30, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Fundamentos de Química Orgânica e Biotecnologia", code: "CCCT0021", hours: 60, type: "bict_mandatory", req: ["CCCT0004"] },
      ]
    },
    {
      semester: 4, phase: "bict", totalHours: 360,
      courses: [
        { name: "Cálculo Numérico",                                           code: "CCCT0022", hours: 60, type: "bict_mandatory", req: ["CCCT0008"] },
        { name: "Mecânica dos Fluídos",                                       code: "CCCT0023", hours: 60, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Mecânica dos Sólidos",                                       code: "CCCT0024", hours: 60, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Física Experimental II",                                     code: "CCCT0025", hours: 30, type: "bict_mandatory", req: ["CCCT0017"] },
        { name: "Eletricidade Aplicada",                                      code: "CCCT0026", hours: 60, type: "bict_mandatory", req: ["CCCT0018"] },
        { name: "Fundamentos de Segurança no Trabalho",                      code: "CCCT0027", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Fenômenos Oscilatórios, Ondas e Óptica",                     code: "CCCT0028", hours: 60, type: "bict_mandatory", req: ["CCCT0011"] },
      ]
    },
    {
      semester: 5, phase: "bict", totalHours: 360,
      courses: [
        { name: "Eletrônica Aplicada",       code: "EECP0001", hours: 60, type: "eng_specific", req: ["CCCT0026"] },
        { name: "Circuitos Digitais",        code: "EECP0002", hours: 60, type: "eng_specific", req: [] },
        { name: "Engenharia de Software",    code: "EECP0003", hours: 60, type: "eng_specific", req: ["CCCT0013"] },
        { name: "Banco de Dados",            code: "EECP0004", hours: 90, type: "eng_specific", req: ["CCCT0013"] },
        { name: "Paradigmas de Programação", code: "EECP0005", hours: 90, type: "eng_specific", req: ["CCCT0013"] },
      ]
    },
    {
      semester: 6, phase: "bict", totalHours: 510,
      courses: [
        { name: "Laboratório de Eletrônica Aplicada",    code: "EECP0006", hours: 60, type: "eng_specific",  req: ["EECP0001"] },
        { name: "Laboratório de Circuitos Digitais",     code: "EECP0007", hours: 60, type: "eng_specific",  req: ["EECP0002"] },
        { name: "Inteligência Artificial",               code: "EECP0008", hours: 60, type: "eng_specific",  req: ["CCCT0013"] },
        { name: "Arquitetura de Computadores",           code: "EECP0009", hours: 60, type: "eng_specific",  req: ["EECP0002"] },
        { name: "Sistemas Operacionais",                 code: "EECP0010", hours: 60, type: "eng_specific",  req: ["CCCT0013"] },
        { name: "Projeto e Desenvolvimento de Software", code: "EECP0011", hours: 60, type: "eng_specific",  req: ["EECP0003"] },
        { name: "Atividades Complementares BICT",        code: "CCCT0089", hours: 90, type: "complementary", req: [] },
        { name: "Trabalho de Conclusão de Curso BICT",   code: "CCCT0100", hours: 60, type: "complementary", req: [] },
      ]
    },
    {
      semester: 7, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "Instrumentação",                               code: "EECP0012", hours: 60, type: "eng_specific", req: ["EECP0006"] },
        { name: "Análise de Sistemas Lineares",                 code: "EECP0013", hours: 90, type: "eng_specific", req: ["CCCT0015"] },
        { name: "Computação Gráfica",                           code: "EECP0014", hours: 60, type: "eng_specific", req: ["EECP0005"] },
        { name: "Lógica e Matemática Discreta",                 code: "EECP0015", hours: 60, type: "eng_specific", req: [] },
        { name: "Comunicação de Dados e Redes de Computadores", code: "EECP0016", hours: 90, type: "eng_specific", req: ["EECP0010"] },
      ]
    },
    {
      semester: 8, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "Engenharia de Controle",          code: "EECP0017", hours: 90, type: "eng_specific", req: ["EECP0012", "EECP0013"] },
        { name: "Processamento Digital de Sinais", code: "EECP0018", hours: 90, type: "eng_specific", req: ["EECP0013"] },
        { name: "Métodos Formais",                 code: "EECP0019", hours: 60, type: "eng_specific", req: ["EECP0015"] },
        { name: "Linguagens Formais e Autômatos",  code: "EECP0020", hours: 60, type: "eng_specific", req: ["EECP0015"] },
        { name: "Sistemas Distribuídos",           code: "EECP0021", hours: 60, type: "eng_specific", req: ["EECP0016"] },
      ]
    },
    {
      semester: 9, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "Automação Industrial",             code: "EECP0022", hours: 90, type: "eng_specific", req: ["EECP0017"] },
        { name: "Sistemas Embarcados",              code: "EECP0023", hours: 60, type: "eng_specific", req: ["EECP0009"] },
        { name: "Processamento de Imagens",         code: "EECP0024", hours: 60, type: "eng_specific", req: ["EECP0018"] },
        { name: "Sistemas de Tempo Real",           code: "EECP0025", hours: 60, type: "eng_specific", req: ["EECP0021"] },
        { name: "Compiladores",                     code: "EECP0026", hours: 60, type: "eng_specific", req: ["EECP0020"] },
        { name: "Trabalho de Conclusão de Curso I", code: "EECP0027", hours: 30, type: "complementary", req: [] },
      ]
    },
    {
      semester: 10, phase: "second_cycle", totalHours: 250,
      courses: [
        { name: "Estágio Supervisionado",            code: "EECP0028", hours: 160, type: "complementary", req: [] },
        { name: "Atividades Complementares",         code: "EECP0029", hours: 60,  type: "complementary", req: [] },
        { name: "Trabalho de Conclusão de Curso II", code: "EECP0030", hours: 30,  type: "complementary", req: ["EECP0027"] },
        { name: "Disciplinas Optativas",             code: "OPT_COMP", hours: 180, type: "eng_specific",  req: [] },
      ]
    },
  ],
  get semesters() { return this.semestersNoturno; }
};

// ============================================================
// NT1 - ENGENHARIA CIVIL (6 níveis BICT + placeholder 2º ciclo)
// ============================================================
const civilData = {
  id: "civil",
  name: "Engenharia Civil",
  shortName: "Eng. Civil",
  code: "NT1",
  color: "orange",
  description: "Construção, Estruturas e Infraestrutura",
  icon: "building",
  gradient: "from-orange-600 to-amber-700",
  accentColor: "#f97316",
  semesters: [
    {
      semester: 1, phase: "bict", totalHours: 360,
      courses: [
        { name: "Ciência, Tecnologia e Sociedade", code: "CCCT0007", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Diferencial", code: "CCCT0091", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Vetores e Geometria Analítica", code: "CCCT0093", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Desenho Computacional", code: "CCCT0002", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Meio Ambiente e Sustentabilidade", code: "CCCT0012", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Química Geral e Inorgânica", code: "CCCT0004", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Práticas de Leitura e Escrita", code: "CCCT0092", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 2, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fundamentos de Computação", code: "CCCT0006", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Integral", code: "CCCT0096", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Álgebra Linear", code: "CCCT0095", hours: 60, type: "bict_mandatory", req: ["CCCT0093"] },
        { name: "Fenômenos Mecânicos", code: "CCCT0011", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Administração e Economia", code: "CCCT0094", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Química Experimental", code: "CCCT0005", hours: 30, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Fundamentos de Segurança no Trabalho", code: "CCCT0027", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Metodologia da Pesquisa Científica", code: "CCCT0003", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 3, phase: "bict", totalHours: 390,
      courses: [
        { name: "Física Experimental I", code: "CCCT0017", hours: 30, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Introdução à Probabilidade e Estatística", code: "CCCT0097", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Oscilações, Ondas e Óptica", code: "CCCT0098", hours: 60, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Funções de Várias Variáveis", code: "CCCT0128", hours: 90, type: "bict_mandatory", req: ["CCCT0096", "CCCT0095"] },
        { name: "Ciência e Tecnologia dos Materiais", code: "CCCT0019", hours: 60, type: "bict_elective", req: [] },
        { name: "Físico-Química Fundamental", code: "CCCT0020", hours: 30, type: "bict_elective", req: ["CCCT0004"] },
        { name: "Fundamentos de Química Orgânica e Biotecnologia", code: "CCCT0021", hours: 60, type: "bict_elective", req: ["CCCT0004"] },
      ]
    },
    {
      semester: 4, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fenômenos Eletromagnéticos", code: "CCCT0018", hours: 60, type: "bict_mandatory", req: ["CCCT0098"] },
        { name: "Cálculo Numérico", code: "CCCT0022", hours: 60, type: "bict_mandatory", req: ["CCCT0096"] },
        { name: "Física Experimental II", code: "CCCT0025", hours: 30, type: "bict_mandatory", req: ["CCCT0017"] },
        { name: "Equações Diferenciais Ordinárias I", code: "CCCT0099", hours: 60, type: "bict_mandatory", req: ["CCCT0128"] },
        { name: "Mecânica dos Fluídos", code: "CCCT0023", hours: 60, type: "bict_elective", req: ["CCCT0011"] },
        { name: "Mecânica dos Sólidos", code: "CCCT0024", hours: 60, type: "bict_elective", req: ["CCCT0011"] },
        { name: "Eletricidade Aplicada", code: "CCCT0026", hours: 60, type: "bict_elective", req: ["CCCT0018"] },
      ]
    },
    {
      semester: 5, phase: "bict", totalHours: 360,
      courses: [
        { name: "Desenho para Engenharias", code: "CCEC0001", hours: 60, type: "eng_specific", req: ["CCCT0002"] },
        { name: "Análise de Estruturas I", code: "CCEC0002", hours: 60, type: "eng_specific", req: ["CCCT0024"] },
        { name: "Geologia", code: "CCEC0003", hours: 60, type: "eng_specific", req: [] },
        { name: "Materiais de Construção I", code: "CCEC0004", hours: 60, type: "eng_specific", req: [] },
        { name: "Fundamentos de Resistência de Materiais", code: "CCEC0005", hours: 60, type: "eng_specific", req: ["CCCT0024"] },
        { name: "Hidráulica I", code: "CCEC0006", hours: 60, type: "eng_specific", req: ["CCCT0023"] },
      ]
    },
    {
      semester: 6, phase: "bict", totalHours: 510,
      courses: [
        { name: "Materiais de Construção II", code: "CCEC0008", hours: 60, type: "eng_specific", req: ["CCEC0004"] },
        { name: "Topografia", code: "CCEC0009", hours: 60, type: "eng_specific", req: [] },
        { name: "Mecânica dos Solos", code: "CCEC0010", hours: 60, type: "eng_specific", req: ["CCEC0003"] },
        { name: "Construção Civil I", code: "CCEC0011", hours: 60, type: "eng_specific", req: [] },
        { name: "Estrutura do Concreto Armado I", code: "CCEC0012", hours: 60, type: "eng_specific", req: ["CCEC0002"] },
        { name: "Hidrologia", code: "CCEC0013", hours: 60, type: "eng_specific", req: ["CCEC0006"] },
        { name: "Atividades Complementares BICT", code: "CCCT0089", hours: 90, type: "complementary", req: [] },
        { name: "Trabalho de Conclusão de Curso BICT", code: "CCCT0100", hours: 60, type: "complementary", req: [] },
      ]
    },
    {
      semester: 7, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "SISTEMAS DE TRANSPORTES", code: "CCEC0014", hours: 60, type: "eng_specific", req: [] },
        { name: "CONSTRUÇÃO CIVIL II", code: "CCEC0015", hours: 60, type: "eng_specific", req: [] },
        { name: "PROJETO DE ESTRADAS", code: "CCEC0016", hours: 60, type: "eng_specific", req: [] },
        { name: "ANÁLISE DE ESTRUTURAS II", code: "CCEC0017", hours: 60, type: "eng_specific", req: [] },
        { name: "MECÂNICA DOS SOLOS II", code: "CCEC0018", hours: 60, type: "eng_specific", req: [] },
        { name: "CONCRETOS E ARGAMASSAS", code: "CCEC0019", hours: 60, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 8, phase: "second_cycle", totalHours: 300,
      courses: [
        { name: "ESTRUTURAS DE MADEIRA", code: "CCEC0020", hours: 60, type: "eng_specific", req: [] },
        { name: "ENGENHARIA DE TRÁFEGO", code: "CCEC0021", hours: 60, type: "eng_specific", req: [] },
        { name: "HIGIENE E SEGURANÇA DO TRABALHO", code: "CCEC0022", hours: 60, type: "eng_specific", req: [] },
        { name: "SANEAMENTO", code: "CCEC0023", hours: 60, type: "eng_specific", req: [] },
        { name: "FUNDAÇÕES I", code: "CCEC0024", hours: 60, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 9, phase: "second_cycle", totalHours: 330,
      courses: [
        { name: "ESTRUTURAS DE AÇO", code: "CCEC0025", hours: 60, type: "eng_specific", req: [] },
        { name: "ORÇAMENTO, PLANEJAMENTO E CONTROLE DE OBRAS", code: "CCEC0026", hours: 60, type: "eng_specific", req: [] },
        { name: "FUNDAÇÕES II", code: "CCEC0027", hours: 60, type: "eng_specific", req: [] },
        { name: "INSTALAÇÕES PREDIAIS", code: "CCEC0028", hours: 60, type: "eng_specific", req: [] },
        { name: "ESTRUTURA DO CONCRETO ARMADO II", code: "CCEC0029", hours: 60, type: "eng_specific", req: [] },
        { name: "TRABALHO DE CONCLUSÃO DO CURSO I", code: "CCEC0055", hours: 30, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 10, phase: "second_cycle", totalHours: 1300,
      courses: [
        { name: "CONCRETO PROTENDIDO", code: "CCEC0035", hours: 60, type: "eng_specific", req: [] },
        { name: "PROJETOS ESTRUTURAIS DE CONCRETO ARMADO", code: "CCEC0036", hours: 60, type: "eng_specific", req: [] },
        { name: "PROJETOS ESTRUTURAIS DE AÇO", code: "CCEC0037", hours: 60, type: "eng_specific", req: [] },
        { name: "PROJETOS ESTRUTURAIS DE MADEIRA", code: "CCEC0038", hours: 60, type: "eng_specific", req: [] },
        { name: "ANÁLISE COMPUTACIONAL DE ESTRUTURAS", code: "CCEC0039", hours: 60, type: "eng_specific", req: [] },
        { name: "EMPUXOS DE TERRA E ESTABILIDADES DE TALUDES", code: "CCEC0040", hours: 60, type: "eng_specific", req: [] },
        { name: "BARRAGENS E OBRAS DE TERRA", code: "CCEC0041", hours: 60, type: "eng_specific", req: [] },
        { name: "INVESTIGAÇÃO GEOTÉCNICA", code: "CCEC0042", hours: 60, type: "eng_specific", req: [] },
        { name: "GEOTECNIA AMBIENTAL", code: "CCEC0043", hours: 60, type: "eng_specific", req: [] },
        { name: "ESTRUTURA DE CONCRETO: PATOLOGIA E REABILITAÇÃO", code: "CCEC0044", hours: 60, type: "eng_specific", req: [] },
        { name: "CONCRETOS E ARGAMASSAS ESPECIAIS", code: "CCEC0045", hours: 60, type: "eng_specific", req: [] },
        { name: "PATOLOGIAS E TERAPIAS DAS CONSTRUÇÕES", code: "CCEC0047", hours: 60, type: "eng_specific", req: [] },
        { name: "PERÍCIA E AVALIAÇÃO DE IMÓVEIS", code: "CCEC0048", hours: 60, type: "eng_specific", req: [] },
        { name: "PORTOS", code: "CCEC0049", hours: 60, type: "eng_specific", req: [] },
        { name: "LOGÍSTICA E TRANSPORTE", code: "CCEC0050", hours: 60, type: "eng_specific", req: [] },
        { name: "GESTÃO EMPRESARIAL E EMPREENDEDORISMO", code: "CCEC0053", hours: 60, type: "eng_specific", req: [] },
        { name: "LEGISLAÇÃO PROFISSIONAL", code: "CCEC0032", hours: 60, type: "eng_specific", req: [] },
        { name: "ATIVIDADES COMPLEMENTARES", code: "CCEC0033", hours: 90, type: "eng_specific", req: [] },
        { name: "ESTÁGIO CURRICULAR", code: "CCEC0034", hours: 160, type: "eng_specific", req: [] },
        { name: "TRABALHO DE CONCLUSÃO DO CURSO II", code: "CCEC0056", hours: 30, type: "eng_specific", req: [] },
      ]
    },
  ]
};

// ============================================================
// NT2 - ENGENHARIA MECÂNICA
// ============================================================
const mecanicaData = {
  id: "mecanica",
  name: "Engenharia Mecânica",
  shortName: "Eng. Mecânica",
  code: "NT2",
  color: "blue",
  description: "Máquinas, Energia e Sistemas Térmicos",
  icon: "cog",
  gradient: "from-blue-600 to-indigo-700",
  accentColor: "#3b82f6",
  semesters: [
    {
      semester: 1, phase: "bict", totalHours: 360,
      courses: [
        { name: "Ciência, Tecnologia e Sociedade", code: "CCCT0007", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Diferencial", code: "CCCT0091", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Vetores e Geometria Analítica", code: "CCCT0093", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Desenho Computacional", code: "CCCT0002", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Meio Ambiente e Sustentabilidade", code: "CCCT0012", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Química Geral e Inorgânica", code: "CCCT0004", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Práticas de Leitura e Escrita", code: "CCCT0092", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 2, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fundamentos de Computação", code: "CCCT0006", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Integral", code: "CCCT0096", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Álgebra Linear", code: "CCCT0095", hours: 60, type: "bict_mandatory", req: ["CCCT0093"] },
        { name: "Fenômenos Mecânicos", code: "CCCT0011", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Administração e Economia", code: "CCCT0094", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Química Experimental", code: "CCCT0005", hours: 30, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Fundamentos de Segurança no Trabalho", code: "CCCT0027", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Metodologia da Pesquisa Científica", code: "CCCT0003", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 3, phase: "bict", totalHours: 390,
      courses: [
        { name: "Física Experimental I", code: "CCCT0017", hours: 30, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Introdução à Probabilidade e Estatística", code: "CCCT0097", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Oscilações, Ondas e Óptica", code: "CCCT0098", hours: 60, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Funções de Várias Variáveis", code: "CCCT0128", hours: 90, type: "bict_mandatory", req: ["CCCT0096", "CCCT0095"] },
        { name: "Ciência e Tecnologia dos Materiais", code: "CCCT0019", hours: 60, type: "bict_elective", req: [] },
        { name: "Empreendedorismo e Inovação", code: "CCCT0034", hours: 60, type: "bict_elective", req: [] },
        { name: "Laboratório de Programação", code: "CCCT0102", hours: 30, type: "bict_elective", req: ["CCCT0006"] },
      ]
    },
    {
      semester: 4, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fenômenos Eletromagnéticos", code: "CCCT0018", hours: 60, type: "bict_mandatory", req: ["CCCT0098"] },
        { name: "Cálculo Numérico", code: "CCCT0022", hours: 60, type: "bict_mandatory", req: ["CCCT0096"] },
        { name: "Física Experimental II", code: "CCCT0025", hours: 30, type: "bict_mandatory", req: ["CCCT0017"] },
        { name: "Equações Diferenciais Ordinárias I", code: "CCCT0099", hours: 60, type: "bict_mandatory", req: ["CCCT0128"] },
        { name: "Mecânica dos Fluídos", code: "CCCT0023", hours: 60, type: "bict_elective", req: ["CCCT0011"] },
        { name: "Mecânica dos Sólidos", code: "CCCT0024", hours: 60, type: "bict_elective", req: ["CCCT0011"] },
        { name: "Eletricidade Aplicada", code: "CCCT0026", hours: 60, type: "bict_elective", req: ["CCCT0018"] },
      ]
    },
    {
      semester: 5, phase: "bict", totalHours: 390,
      courses: [
        { name: "Resistência dos Materiais I", code: "CCEM0001", hours: 60, type: "eng_specific", req: ["CCCT0024"] },
        { name: "Dinâmica", code: "CCEM0002", hours: 60, type: "eng_specific", req: ["CCCT0011"] },
        { name: "Desenho de Máquinas", code: "CCEM0003", hours: 30, type: "eng_specific", req: ["CCCT0002"] },
        { name: "Mecânica dos Fluídos II", code: "CCEM0004", hours: 60, type: "eng_specific", req: ["CCCT0023"] },
        { name: "Termodinâmica Aplicada", code: "CCEM0005", hours: 60, type: "eng_specific", req: ["CCCT0011"] },
        { name: "Materiais para Engenharia", code: "CCEM0006", hours: 60, type: "eng_specific", req: ["CCCT0019"] },
        { name: "Máquinas Elétricas", code: "CCEM0007", hours: 60, type: "eng_specific", req: ["CCCT0018"] },
      ]
    },
    {
      semester: 6, phase: "bict", totalHours: 540,
      courses: [
        { name: "Resistência dos Materiais II", code: "CCEM0008", hours: 60, type: "eng_specific", req: ["CCEM0001"] },
        { name: "Modelagem de Sistemas Mecânicos", code: "CCEM0009", hours: 60, type: "eng_specific", req: ["CCEM0001"] },
        { name: "Mecanismos", code: "CCEM0010", hours: 45, type: "eng_specific", req: ["CCEM0002"] },
        { name: "Transferência de Calor I", code: "CCEM0011", hours: 60, type: "eng_specific", req: ["CCEM0005"] },
        { name: "Máquinas Térmicas", code: "CCEM0012", hours: 60, type: "eng_specific", req: ["CCEM0005"] },
        { name: "Processo de Fabricação Mecânica I", code: "CCEM0013", hours: 60, type: "eng_specific", req: [] },
        { name: "Laboratório de Materiais", code: "CCEM0014", hours: 45, type: "eng_specific", req: ["CCEM0006"] },
        { name: "Atividades Complementares BICT", code: "CCCT0089_M", hours: 90, type: "complementary", req: [] },
        { name: "Trabalho de Conclusão de Curso BICT", code: "CCCT0100_M", hours: 60, type: "complementary", req: [] },
      ]
    },
    {
      semester: 7, phase: "second_cycle", totalHours: 390,
      courses: [
        { name: "VIBRAÇÕES MECÂNICAS", code: "CCEM0015", hours: 60, type: "eng_specific", req: [] },
        { name: "ELEMENTO DE MÁQUINAS I", code: "CCEM0016", hours: 60, type: "eng_specific", req: [] },
        { name: "CONTROLE DE SISTEMAS MECÂNICOS", code: "CCEM0017", hours: 60, type: "eng_specific", req: [] },
        { name: "MÁQUINAS DE FLUXO I", code: "CCEM0018", hours: 60, type: "eng_specific", req: [] },
        { name: "TRANSFERÊNCIA DE CALOR II", code: "CCEM0019", hours: 30, type: "eng_specific", req: [] },
        { name: "LABORATÓRIO DE CALOR E FLUÍDO I", code: "CCEM0020", hours: 30, type: "eng_specific", req: [] },
        { name: "LABORATÓRIO DE PROCESSO DE FABRICAÇÃO MECÂNICA I", code: "CCEM0021", hours: 30, type: "eng_specific", req: [] },
        { name: "PROCESSO DE FABRICAÇÃO MECÂNICA II", code: "CCEM0022", hours: 60, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 8, phase: "second_cycle", totalHours: 390,
      courses: [
        { name: "MECÂNICA COMPUTACIONAL", code: "CCEM0023", hours: 45, type: "eng_specific", req: [] },
        { name: "ELEMENTO DE MÁQUINAS II", code: "CCEM0024", hours: 60, type: "eng_specific", req: [] },
        { name: "REFRIGERAÇÃO E AR CONDICIONADO", code: "CCEM0025", hours: 60, type: "eng_specific", req: [] },
        { name: "MÁQUINAS DE FLUXO II", code: "CCEM0026", hours: 60, type: "eng_specific", req: [] },
        { name: "LABORATÓRIO DE CALOR E FLUÍDO II", code: "CCEM0027", hours: 30, type: "eng_specific", req: [] },
        { name: "PROCESSO DE FABRICAÇÃO MECÂNICA III", code: "CCEM0028", hours: 60, type: "eng_specific", req: [] },
        { name: "SELEÇÃO DE MATERIAIS", code: "CCEM0029", hours: 45, type: "eng_specific", req: [] },
        { name: "LABORATÓRIO DE PROCESSO DE FABRICAÇÃO MECÂNICA II", code: "CCEM0030", hours: 30, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 9, phase: "second_cycle", totalHours: 330,
      courses: [
        { name: "MANUTENÇÃO INDUSTRIAL", code: "CCEM0031", hours: 30, type: "eng_specific", req: [] },
        { name: "INSTRUMENTAÇÃO", code: "CCEM0032", hours: 30, type: "eng_specific", req: [] },
        { name: "SISTEMAS FLUÍDOS TÉRMICOS", code: "CCEM0033", hours: 30, type: "eng_specific", req: [] },
        { name: "FABRICAÇÃO ASSISTIDA POR COMPUTADOR", code: "CCEM0034", hours: 60, type: "eng_specific", req: [] },
        { name: "CORROSÃO E DEGRADAÇÃO DE MATERIAIS", code: "CCEM0035", hours: 30, type: "eng_specific", req: [] },
        { name: "FABRICAÇÃO DE SISTEMAS MECÂNICOS", code: "CCEM0036", hours: 60, type: "eng_specific", req: [] },
        { name: "PESQUISA OPERACIONAL", code: "CCEM0037", hours: 60, type: "eng_specific", req: [] },
        { name: "TRABALHO DE CONCLUSÃO DE CURSO I", code: "CCEM0039", hours: 30, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 10, phase: "second_cycle", totalHours: 1580,
      courses: [
        { name: "VENTILAÇÃO INDUSTRIAL", code: "CCEM0043", hours: 60, type: "eng_specific", req: [] },
        { name: "SISTEMAS FRIGORÍFICOS", code: "CCEM0044", hours: 60, type: "eng_specific", req: [] },
        { name: "DINÂMICA DOS FLUÍDOS COMPUTACIONAIS", code: "CCEM0045", hours: 60, type: "eng_specific", req: [] },
        { name: "GERAÇÃO E DISTRIBUIÇÃO DE VAPOR", code: "CCEM0046", hours: 60, type: "eng_specific", req: [] },
        { name: "TÓPICOS ESPECIAIS EM ENERGIA", code: "CCEM0047", hours: 60, type: "eng_specific", req: [] },
        { name: "MATERIAIS CERÂMICOS", code: "CCEM0048", hours: 60, type: "eng_specific", req: [] },
        { name: "MATERIAIS POLIMÉRICOS", code: "CCEM0049", hours: 60, type: "eng_specific", req: [] },
        { name: "MATERIAIS COMPÓSITOS", code: "CCEM0050", hours: 60, type: "eng_specific", req: [] },
        { name: "TÓPICOS ESPECIAIS EM MATERIAIS", code: "CCEM0051", hours: 60, type: "eng_specific", req: [] },
        { name: "TÓPICOS ESPECIAIS EM PROCESSOS DE FABRICAÇÃO", code: "CCEM0052", hours: 60, type: "eng_specific", req: [] },
        { name: "ACÚSTICA BÁSICA", code: "CCEM0053", hours: 60, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO A MANIPULADORES ROBÓTICOS", code: "CCEM0054", hours: 60, type: "eng_specific", req: [] },
        { name: "ANÁLISE ESTRUTURAL", code: "CCEM0055", hours: 60, type: "eng_specific", req: [] },
        { name: "PROCESSAMENTO DE SINAIS", code: "CCEM0056", hours: 60, type: "eng_specific", req: [] },
        { name: "TÓPICOS ESPECIAIS EM PROJETOS MECÂNICOS", code: "CCEM0057", hours: 60, type: "eng_specific", req: [] },
        { name: "ENGENHARIA ECONÔMICA", code: "CCEM0058", hours: 60, type: "eng_specific", req: [] },
        { name: "GESTÃO DOS SISTEMAS DE PRODUÇÃO", code: "CCEM0059", hours: 60, type: "eng_specific", req: [] },
        { name: "LOGÍSTICA EMPRESARIAL", code: "CCEM0060", hours: 60, type: "eng_specific", req: [] },
        { name: "TÓPICOS ESPECIAIS EM PLANEJAMENTO E GESTÃO", code: "CCEM0061", hours: 60, type: "eng_specific", req: [] },
        { name: "SISTEMAS TRIBOLÓGICOS", code: "CCEM0062", hours: 60, type: "eng_specific", req: [] },
        { name: "TÓPICOS EM PROJETOS MECÂNICOS: PROJETO INTEGRADOR I", code: "CCEM0063", hours: 60, type: "eng_specific", req: [] },
        { name: "PLANEJAMENTO E CONTROLE DA PRODUÇÃO", code: "CCEM0038", hours: 30, type: "eng_specific", req: [] },
        { name: "TRABALHO DE CONCLUSÃO DE CURSO II", code: "CCEM0040", hours: 30, type: "eng_specific", req: [] },
        { name: "ESTÁGIO SUPERVISIONADO", code: "CCEM0041", hours: 160, type: "eng_specific", req: [] },
        { name: "ATIVIDADES COMPLEMENTARES", code: "CCEM0042", hours: 100, type: "eng_specific", req: [] },
      ]
    },
  ]
};

// ============================================================
// NT3 - ENGENHARIA AMBIENTAL E SANITÁRIA
// ============================================================
const ambientalData = {
  id: "ambiental",
  name: "Eng. Ambiental e Sanitária",
  shortName: "Eng. Ambiental",
  code: "NT3",
  color: "green",
  description: "Meio Ambiente, Saneamento e Sustentabilidade",
  icon: "leaf",
  gradient: "from-green-600 to-emerald-700",
  accentColor: "#22c55e",
  semesters: [
    {
      semester: 1, phase: "bict", totalHours: 360,
      courses: [
        { name: "Ciência, Tecnologia e Sociedade", code: "CCCT0007", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Diferencial", code: "CCCT0091", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Vetores e Geometria Analítica", code: "CCCT0093", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Desenho Computacional", code: "CCCT0002", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Meio Ambiente e Sustentabilidade", code: "CCCT0012", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Química Geral e Inorgânica", code: "CCCT0004", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Práticas de Leitura e Escrita", code: "CCCT0092", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 2, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fundamentos de Computação", code: "CCCT0006", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Integral", code: "CCCT0096", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Álgebra Linear", code: "CCCT0095", hours: 60, type: "bict_mandatory", req: ["CCCT0093"] },
        { name: "Fenômenos Mecânicos", code: "CCCT0011", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Administração e Economia", code: "CCCT0094", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Química Experimental", code: "CCCT0005", hours: 30, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Fundamentos de Segurança no Trabalho", code: "CCCT0027", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Metodologia da Pesquisa Científica", code: "CCCT0003", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 3, phase: "bict", totalHours: 390,
      courses: [
        { name: "Física Experimental I", code: "CCCT0017", hours: 30, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Introdução à Probabilidade e Estatística", code: "CCCT0097", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Oscilações, Ondas e Óptica", code: "CCCT0098", hours: 60, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Funções de Várias Variáveis", code: "CCCT0128", hours: 90, type: "bict_mandatory", req: ["CCCT0096", "CCCT0095"] },
        { name: "Ciência e Tecnologia dos Materiais", code: "CCCT0019", hours: 60, type: "bict_elective", req: [] },
        { name: "Físico-Química Fundamental", code: "CCCT0020", hours: 30, type: "bict_elective", req: ["CCCT0004"] },
        { name: "Fundamentos de Química Orgânica e Biotecnologia", code: "CCCT0021", hours: 60, type: "bict_elective", req: ["CCCT0004"] },
      ]
    },
    {
      semester: 4, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fenômenos Eletromagnéticos", code: "CCCT0018", hours: 60, type: "bict_mandatory", req: ["CCCT0098"] },
        { name: "Cálculo Numérico", code: "CCCT0022", hours: 60, type: "bict_mandatory", req: ["CCCT0096"] },
        { name: "Física Experimental II", code: "CCCT0025", hours: 30, type: "bict_mandatory", req: ["CCCT0017"] },
        { name: "Equações Diferenciais Ordinárias I", code: "CCCT0099", hours: 60, type: "bict_mandatory", req: ["CCCT0128"] },
        { name: "Mecânica dos Fluídos", code: "CCCT0023", hours: 60, type: "bict_elective", req: ["CCCT0011"] },
        { name: "Mecânica dos Sólidos", code: "CCCT0024", hours: 60, type: "bict_elective", req: ["CCCT0011"] },
        { name: "Eletricidade Aplicada", code: "CCCT0026", hours: 60, type: "bict_elective", req: ["CCCT0018"] },
      ]
    },
    {
      semester: 5, phase: "bict", totalHours: 360,
      courses: [
        { name: "Microbiologia Ambiental", code: "CCAS0025", hours: 60, type: "eng_specific", req: [] },
        { name: "Topografia", code: "CCAS0026", hours: 60, type: "eng_specific", req: [] },
        { name: "Geologia", code: "CCAS0027", hours: 60, type: "eng_specific", req: [] },
        { name: "Materiais de Construção", code: "CCAS0028", hours: 60, type: "eng_specific", req: [] },
        { name: "Hidráulica I", code: "CCAS0029", hours: 60, type: "eng_specific", req: ["CCCT0023"] },
        { name: "Resistência dos Materiais", code: "CCAS0030", hours: 60, type: "eng_specific", req: ["CCCT0024"] },
      ]
    },
    {
      semester: 6, phase: "bict", totalHours: 510,
      courses: [
        { name: "Saúde Ambiental", code: "CCAS0031", hours: 60, type: "eng_specific", req: [] },
        { name: "Soluções Sanitárias Unidomiciliar Apropriada", code: "CCAS0032", hours: 60, type: "eng_specific", req: [] },
        { name: "Mecânica dos Solos", code: "CCAS0033", hours: 60, type: "eng_specific", req: ["CCAS0027"] },
        { name: "Construção Civil", code: "CCAS0034", hours: 60, type: "eng_specific", req: [] },
        { name: "Estrutura do Concreto Armado", code: "CCAS0035", hours: 60, type: "eng_specific", req: [] },
        { name: "Hidráulica II", code: "CCAS0036", hours: 60, type: "eng_specific", req: ["CCAS0029"] },
        { name: "Atividades Complementares BICT", code: "CCCT0089_A", hours: 90, type: "complementary", req: [] },
        { name: "Trabalho de Conclusão de Curso BICT", code: "CCCT0100_A", hours: 60, type: "complementary", req: [] },
      ]
    },
    {
      semester: 7, phase: "second_cycle", totalHours: 270,
      courses: [
        { name: "OPERAÇÕES UNITÁRIA FÍSICO QUÍMICA E BIOLÓGICA APLICADA A ETE E ETA - OPU", code: "CCAS0001", hours: 60, type: "eng_specific", req: [] },
        { name: "ANÁLISE DA QUALIDADE DA ÁGUA", code: "CCAS0002", hours: 60, type: "eng_specific", req: [] },
        { name: "HIDROLOGIA", code: "CCAS0003", hours: 60, type: "eng_specific", req: [] },
        { name: "INSTALAÇÕES PREDIAIS", code: "CCAS0004", hours: 90, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 8, phase: "second_cycle", totalHours: 270,
      courses: [
        { name: "AVALIAÇÃO DO IMPACTO AMBIENTAL", code: "CCAS0005", hours: 60, type: "eng_specific", req: [] },
        { name: "POLUIÇÃO ATMOSFÉRICA - AVALIAÇÃO, MONITORAMENTO E TÉCNICAS DE ABATIMENTO", code: "CCAS0006", hours: 60, type: "eng_specific", req: [] },
        { name: "CORPOS HÍDRICOS - AVALIAÇÃO, MONITORAMENTO E CONTROLE DA POLUIÇÃO", code: "CCAS0007", hours: 60, type: "eng_specific", req: [] },
        { name: "POLUIÇÃO DE SOLO - AVALIAÇÃO, MONITORAMENTO E REMEDIAÇÃO", code: "CCAS0008", hours: 60, type: "eng_specific", req: [] },
        { name: "OFICINA I: ANALISTA AMBIENTAL", code: "CCAS0009", hours: 30, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 9, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "SISTEMAS URBANOS DE ABASTECIMENTO DE ÁGUA POTÁVEL E ESGOTAMENTO SANITÁRIO", code: "CCAS0010", hours: 90, type: "eng_specific", req: [] },
        { name: "TECNOLOGIA DE POTABILIZAÇÃO DE ÁGUA", code: "CCAS0011", hours: 60, type: "eng_specific", req: [] },
        { name: "TECNOLOGIA DE TRATAMENTOS DE EFLUENTES SANITÁRIOS E INDUSTRIAIS", code: "CCAS0012", hours: 60, type: "eng_specific", req: [] },
        { name: "RESÍDUOS SÓLIDOS - MANEJO. LIMPEZA PÚBLICA, TECNOLOGIA DE TRATAMENTO", code: "CCAS0013", hours: 60, type: "eng_specific", req: [] },
        { name: "MANEJO E DRENAGEM DE ÁGUAS PLUVIAIS", code: "CCAS0014", hours: 60, type: "eng_specific", req: [] },
        { name: "OFICINA II: PROJETO DE ENGENHARIA SANITÁRIA", code: "CCAS0015", hours: 30, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 10, phase: "second_cycle", totalHours: 3510,
      courses: [
        { name: "INTRODUÇÃO A METEOROLOGIA E CLIMATOLOGIA", code: "CCAS0038", hours: 60, type: "eng_specific", req: [] },
        { name: "EDUCAÇÃO AMBIENTAL", code: "CCAS0039", hours: 60, type: "eng_specific", req: [] },
        { name: "ECOTOXICOLOGIA", code: "CCAS0041", hours: 60, type: "eng_specific", req: [] },
        { name: "ECONOMIA DO HIDROGÊNIO", code: "CCAS0042", hours: 30, type: "eng_specific", req: [] },
        { name: "POLÍTICAS PÚBLICAS (CT)", code: "CCCT0046", hours: 60, type: "eng_specific", req: [] },
        { name: "DESENHO PARA ENGENHARIAS", code: "CCCT0081", hours: 60, type: "eng_specific", req: [] },
        { name: "LEGISLAÇÃO E DIREITO AMBIENTAL", code: "CEAM0044", hours: 60, type: "eng_specific", req: [] },
        { name: "BIOLOGIA PARASITÁRIA", code: "DBIO0304", hours: 60, type: "eng_specific", req: [] },
        { name: "ECOLOGIA DE SISTEMAS", code: "DBIO0305", hours: 60, type: "eng_specific", req: [] },
        { name: "BIOLOGIA DA CONSERVAÇÃO", code: "DBIO0306", hours: 60, type: "eng_specific", req: [] },
        { name: "SAÚDE E AMBIENTE", code: "DBIO0307", hours: 60, type: "eng_specific", req: [] },
        { name: "ECOLOGIA DAS POPULAÇÕES E COMUNIDADES", code: "DBIO0308", hours: 60, type: "eng_specific", req: [] },
        { name: "ECONOMIA ECOLÓGICA", code: "DCON0155", hours: 60, type: "eng_specific", req: [] },
        { name: "DIREITO AMBIENTAL (CA)", code: "DDIR0120", hours: 60, type: "eng_specific", req: [] },
        { name: "DIREITO E LEGISLAÇÃO SOCIAL", code: "DDIR0246", hours: 60, type: "eng_specific", req: [] },
        { name: "FUNDAMENTOS DO DIREITO PÚBLICO E PRIVADO", code: "DDIR0247", hours: 60, type: "eng_specific", req: [] },
        { name: "DIREITO DO TRABALHO E PREVIDÊNCIA SOCIAL", code: "DDIR0248", hours: 60, type: "eng_specific", req: [] },
        { name: "DIREITO URBANO", code: "DDIR0249", hours: 60, type: "eng_specific", req: [] },
        { name: "DIREITO AMBIENTAL", code: "DDIR0250", hours: 60, type: "eng_specific", req: [] },
        { name: "CONTABILIDADE SOCIOAMBIENTAL (CC)", code: "DECC0212", hours: 60, type: "eng_specific", req: [] },
        { name: "TOXICOLOGIA DE ALIMENTOS", code: "DEFA0098", hours: 60, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO AO SENSORIAMENTO REMOTO (OC)", code: "DEOL0098", hours: 60, type: "eng_specific", req: [] },
        { name: "MONIT. E REC DE ÁREAS DEGR COSTEIRAS (OC", code: "DEOL0102", hours: 60, type: "eng_specific", req: [] },
        { name: "LIMNOLOGIA SANITÁRIA (OC)", code: "DEOL0109", hours: 60, type: "eng_specific", req: [] },
        { name: "BILOGIA GERAL DOS ORGANISMOS AQUÁTICOS", code: "DEOL0138", hours: 60, type: "eng_specific", req: [] },
        { name: "AMBIENTES CONTINENTAIS AQUÁTICOS E DE TRANSIÇÃO", code: "DEOL0139", hours: 60, type: "eng_specific", req: [] },
        { name: "ECOTOXICOLOGIA", code: "DEOL0140", hours: 60, type: "eng_specific", req: [] },
        { name: "POLUIÇÃO MARINHA", code: "DEOL0141", hours: 60, type: "eng_specific", req: [] },
        { name: "LIMNOLOGIA SANITÁRIA", code: "DEOL0142", hours: 60, type: "eng_specific", req: [] },
        { name: "BOTÂNICA COSTEIRA", code: "DEOL0143", hours: 60, type: "eng_specific", req: [] },
        { name: "MODELAGEM DE SISTEMAS AQUÁTICOS", code: "DEOL0144", hours: 60, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO À METEREOLOGIA E CLIMATOLOGIA", code: "DEOL0145", hours: 60, type: "eng_specific", req: [] },
        { name: "SUSTENTABILIDADE DE SISTEMAS COSTEIROS", code: "DEOL0146", hours: 60, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO AO SENSORIAMENTO REMOTO", code: "DEOL0147", hours: 60, type: "eng_specific", req: [] },
        { name: "GEOPROCESSAMENTO", code: "DEOL0148", hours: 60, type: "eng_specific", req: [] },
        { name: "MONITORAMENTO E RECUPERAÇÃO DE ÁREAS DEGRADADAS COSTEIRAS", code: "DEOL0149", hours: 60, type: "eng_specific", req: [] },
        { name: "INDICADORES BIOLÓGICOS E MONITORAMENTO AMBIENTAL", code: "DEOL0150", hours: 60, type: "eng_specific", req: [] },
        { name: "QUÍMICA DO MEIO AMBIENTE", code: "DEQU0171", hours: 60, type: "eng_specific", req: [] },
        { name: "GEOQUÍMICA", code: "DEQU0172", hours: 60, type: "eng_specific", req: [] },
        { name: "EPIDEMIOLOGIA DESCRITIVA", code: "DESP0096", hours: 60, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO AO SENSORIAMENTO REMOTO (GE)", code: "DGEO0121", hours: 60, type: "eng_specific", req: [] },
        { name: "GEOPROCESSAMENTO (GE)", code: "DGEO0127", hours: 60, type: "eng_specific", req: [] },
        { name: "EDUCAÇÃO AMBIENTAL", code: "DGEO0251", hours: 60, type: "eng_specific", req: [] },
        { name: "CLIMATOLOGIA", code: "DGEO0252", hours: 60, type: "eng_specific", req: [] },
        { name: "GEOMORFOLOGIA", code: "DGEO0253", hours: 60, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO AO SENSORIAMENTO REMOTO", code: "DGEO0254", hours: 60, type: "eng_specific", req: [] },
        { name: "GEOGRAFIA URBANA", code: "DGEO0255", hours: 60, type: "eng_specific", req: [] },
        { name: "GEOPROCESSAMENTO", code: "DGEO0256", hours: 60, type: "eng_specific", req: [] },
        { name: "GESTÃO AMBIENTAL DO TURISMO", code: "DTUH0114", hours: 60, type: "eng_specific", req: [] },
        { name: "ORGANIZAÇÃO DOS SERVIÇOS DE SANEAMENTO BÁSICO", code: "CCAS0016", hours: 60, type: "eng_specific", req: [] },
        { name: "SERVIÇOS DE SANEAMENTO - OBRAS, MANUTENÇÃO E OPERAÇÃO", code: "CCAS0017", hours: 60, type: "eng_specific", req: [] },
        { name: "GESTÃO AMBIENTAL", code: "CCAS0018", hours: 60, type: "eng_specific", req: [] },
        { name: "GESTÃO DOS CORPOS HÍDRICOS", code: "CCAS0019", hours: 60, type: "eng_specific", req: [] },
        { name: "OFICINA III: GESTÃO", code: "CCAS0020", hours: 30, type: "eng_specific", req: [] },
        { name: "TRABALHO DE CONCLUSÃO DO CURSO I - QUALIFICAÇÃO DO PROJETO", code: "CCAS0021", hours: 30, type: "eng_specific", req: [] },
        { name: "TRABALHO DE CONCLUSÃO DO CURSO I - DEFESA DO PROJETO", code: "CCAS0022", hours: 30, type: "eng_specific", req: [] },
        { name: "ATIVIDADES COMPLEMENTARES", code: "CCAS0023", hours: 90, type: "eng_specific", req: [] },
        { name: "ESTÁGIO CURRICULAR", code: "CCAS0024", hours: 180, type: "eng_specific", req: [] },
      ]
    },
  ]
};

// ============================================================
// NT5 - ENGENHARIA AEROESPACIAL
// ============================================================
const aeroespacialData = {
  id: "aeroespacial",
  name: "Engenharia Aeroespacial",
  shortName: "Eng. Aeroespacial",
  code: "NT5",
  color: "cyan",
  description: "Aeronáutica, Espaço e Sistemas Aeroespaciais",
  icon: "rocket",
  gradient: "from-cyan-600 to-blue-700",
  accentColor: "#0891b2",
  semesters: [
    {
      semester: 1, phase: "bict", totalHours: 360,
      courses: [
        { name: "DESENHO COMPUTACIONAL (CT)", code: "CCCT0002", hours: 60, type: "eng_specific", req: [] },
        { name: "QUÍMICA GERAL E INORGÂNICA (CT)", code: "CCCT0004", hours: 60, type: "eng_specific", req: [] },
        { name: "CIÊNCIA, TECNOLOGIA E SOCIEDADE (CT)", code: "CCCT0007", hours: 60, type: "eng_specific", req: [] },
        { name: "MEIO AMBIENTE E SUSTENTABILIDADE (CT)", code: "CCCT0012", hours: 30, type: "eng_specific", req: [] },
        { name: "CÁLCULO DIFERENCIAL", code: "CCCT0091", hours: 60, type: "eng_specific", req: [] },
        { name: "PRÁTICAS DE LEITURA E ESCRITA", code: "CCCT0092", hours: 30, type: "eng_specific", req: [] },
        { name: "VETORES E GEOMETRIA ANALÍTICA", code: "CCCT0093", hours: 60, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 2, phase: "bict", totalHours: 390,
      courses: [
        { name: "METODOLOGIA DA PESQUISA CIENTÍFICA (CT)", code: "CCCT0003", hours: 30, type: "eng_specific", req: [] },
        { name: "QUÍMICA EXPERIMENTAL (CT)", code: "CCCT0005", hours: 30, type: "eng_specific", req: [] },
        { name: "FUNDAMENTOS DE COMPUTAÇÃO (CT)", code: "CCCT0006", hours: 60, type: "eng_specific", req: [] },
        { name: "FENÔMENOS MECÂNICOS (CT)", code: "CCCT0011", hours: 60, type: "eng_specific", req: [] },
        { name: "FUNDAMENTOS DE SEGURANÇA NO TRABALHO (CT)", code: "CCCT0027", hours: 30, type: "eng_specific", req: [] },
        { name: "ADMINISTRAÇÃO E ECONOMIA", code: "CCCT0094", hours: 60, type: "eng_specific", req: [] },
        { name: "ÁLGEBRA LINEAR", code: "CCCT0095", hours: 60, type: "eng_specific", req: [] },
        { name: "CÁLCULO INTEGRAL", code: "CCCT0096", hours: 60, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 3, phase: "bict", totalHours: 390,
      courses: [
        { name: "FÍSICA EXPERIMENTAL I (CT)", code: "CCCT0017", hours: 30, type: "eng_specific", req: [] },
        { name: "CIÊNCIA E TECNOLOGIA DOS MATERIAIS (CT)", code: "CCCT0019", hours: 60, type: "eng_specific", req: [] },
        { name: "MECÂNICA DOS SÓLIDOS (CT)", code: "CCCT0024", hours: 60, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO À PROBABILIDADE E ESTATÍSTICA", code: "CCCT0097", hours: 60, type: "eng_specific", req: [] },
        { name: "OSCILAÇÕES, ONDAS E ÓPTICA", code: "CCCT0098", hours: 60, type: "eng_specific", req: [] },
        { name: "FENÔMENOS TÉRMICOS", code: "CCCT0105", hours: 30, type: "eng_specific", req: [] },
        { name: "FUNÇÕES DE VÁRIAS VARIÁVEIS", code: "CCCT0128", hours: 90, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 4, phase: "bict", totalHours: 390,
      courses: [
        { name: "FENÔMENOS ELETROMAGNÉTICOS (CT)", code: "CCCT0018", hours: 60, type: "eng_specific", req: [] },
        { name: "CÁLCULO NUMÉRICO (CT)", code: "CCCT0022", hours: 60, type: "eng_specific", req: [] },
        { name: "MECÂNICA DOS FLUÍDOS (CT)", code: "CCCT0023", hours: 60, type: "eng_specific", req: [] },
        { name: "FÍSICA EXPERIMENTAL II (CT)", code: "CCCT0025", hours: 30, type: "eng_specific", req: [] },
        { name: "ELETRICIDADE APLICADA (CT)", code: "CCCT0026", hours: 60, type: "eng_specific", req: [] },
        { name: "RESISTÊNCIA DOS MATERIAIS I", code: "CCCT0053", hours: 60, type: "eng_specific", req: [] },
        { name: "EQUAÇÕES DIFERENCIAIS ORDINÁRIAS I", code: "CCCT0099", hours: 60, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 5, phase: "bict", totalHours: 360,
      courses: [
        { name: "ELETRÔNICA APLICADA", code: "CCCT0048", hours: 60, type: "eng_specific", req: [] },
        { name: "MECÂNICA DOS FLUÍDOS II", code: "CCCT0057", hours: 60, type: "eng_specific", req: [] },
        { name: "LABORATÓRIO DE PROGRAMAÇÃO", code: "CCCT0102", hours: 30, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO À SINAIS E SISTEMAS LINEARES", code: "EAER0001", hours: 60, type: "eng_specific", req: [] },
        { name: "COMBUSTÍVEIS AVANÇADOS", code: "EAER0008", hours: 60, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO À MECÂNICA DO ORBITAL", code: "EAER0009", hours: 30, type: "eng_specific", req: [] },
        { name: "INSTRUMENTAÇÃO", code: "EECP0012", hours: 60, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 6, phase: "bict", totalHours: 510,
      courses: [
        { name: "CIRCUITOS DIGITAIS", code: "CCCT0049", hours: 60, type: "eng_specific", req: [] },
        { name: "LABORATÓRIO DE ELETRÔNICA APLICADA", code: "CCCT0083", hours: 60, type: "eng_specific", req: [] },
        { name: "INTELIGÊNCIA ARTIFICIAL", code: "CCCT0085", hours: 60, type: "eng_specific", req: [] },
        { name: "ATIVIDADES COMPLEMENTARES", code: "CCCT0089", hours: 90, type: "eng_specific", req: [] },
        { name: "TRABALHO DE CONCLUSÃO DE CURSO", code: "CCCT0100", hours: 60, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO À TELEMETRIA AEROESPACIAL", code: "EAER0002", hours: 60, type: "eng_specific", req: [] },
        { name: "GOVERNANÇA E CIDADANIA", code: "EAER0003", hours: 60, type: "eng_specific", req: [] },
        { name: "ENGENHARIA DE CONTROLE", code: "EAER0006", hours: 60, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 7, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "TÓPICOS DE OPERAÇÕES EM CENTROS ESPACIAIS", code: "EAER0004", hours: 60, type: "eng_specific", req: [] },
        { name: "ARQUITETURA DE COMPUTADORES", code: "EAER0005", hours: 60, type: "eng_specific", req: [] },
        { name: "PROCESSAMENTO DIGITAL DE SINAIS", code: "EAER0010", hours: 60, type: "eng_specific", req: [] },
        { name: "MATERIAIS DE USO AEROESPACIAL", code: "EAER0011", hours: 60, type: "eng_specific", req: [] },
        { name: "LABORATÓRIO DE CIRCUITOS DIGITAIS", code: "EAER0012", hours: 30, type: "eng_specific", req: [] },
        { name: "DIREITO ADMINISTRATIVO", code: "EAER0013", hours: 60, type: "eng_specific", req: [] },
        { name: "LABORATÓRIO DE CONTROLE", code: "EAER0014", hours: 30, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 8, phase: "second_cycle", totalHours: 520,
      courses: [
        { name: "SISTEMAS EMBARCADOS", code: "EAER0015", hours: 60, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO À TECNOLOGIA DE FOGUETES", code: "EAER0016", hours: 60, type: "eng_specific", req: [] },
        { name: "AUTOMAÇÃO DE SISTEMAS", code: "EAER0017", hours: 60, type: "eng_specific", req: [] },
        { name: "PLANEJAMENTO ESTRATÉGICO", code: "EAER0018", hours: 60, type: "eng_specific", req: [] },
        { name: "LOGÍSTICA", code: "EAER0019", hours: 60, type: "eng_specific", req: [] },
        { name: "PRINCÍPIOS DE AERODINÂMICA", code: "EAER0020", hours: 60, type: "eng_specific", req: [] },
        { name: "ESTÁGIO SUPERVISIONADO OBRIGATÓRIO", code: "EAER0021", hours: 160, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 9, phase: "second_cycle", totalHours: 420,
      courses: [
        { name: "PROJETO DE SATÉLITE", code: "EAER0022", hours: 60, type: "eng_specific", req: [] },
        { name: "NEGOCIAÇÃO E PROCESSO DECISÓRIO", code: "EAER0023", hours: 60, type: "eng_specific", req: [] },
        { name: "FLUIDODINÂMICA COMPUTACIONAL", code: "EAER0024", hours: 60, type: "eng_specific", req: [] },
        { name: "INTRODUÇÃO À SISTEMAS PROPULSIVOS", code: "EAER0025", hours: 60, type: "eng_specific", req: [] },
        { name: "TRABALHO DE CONCLUSÃO DE CURSO", code: "EAER0026", hours: 60, type: "eng_specific", req: [] },
        { name: "GOVERNANÇA DE TECNOLOGIA DA INFORMAÇÃO", code: "EAER0052", hours: 60, type: "eng_specific", req: [] },
        { name: "ATIVIDADES COMPLEMENTARES", code: "EAER0055", hours: 60, type: "eng_specific", req: [] },
      ]
    },
    {
      semester: 10, phase: "second_cycle", totalHours: 1350,
      courses: [
        { name: "ANTENAS E RADARES", code: "EAER0027", hours: 60, type: "eng_specific", req: [] },
        { name: "SISTEMAS DE TEMPO REAL", code: "EAER0028", hours: 60, type: "eng_specific", req: [] },
        { name: "FILTROS ADAPTATIVOS", code: "EAER0029", hours: 60, type: "eng_specific", req: [] },
        { name: "PRINCÍPIOS DE ROBÓTICA", code: "EAER0030", hours: 60, type: "eng_specific", req: [] },
        { name: "PARADIGMAS DE PROGRAMAÇÃO", code: "EAER0031", hours: 60, type: "eng_specific", req: [] },
        { name: "METEOROLOGIA APLICADA", code: "EAER0032", hours: 60, type: "eng_specific", req: [] },
        { name: "TÓPICOS EM OPERAÇÕES SATELITAIS", code: "EAER0033", hours: 60, type: "eng_specific", req: [] },
        { name: "GESTÃO AMBIENTAL", code: "EAER0034", hours: 60, type: "eng_specific", req: [] },
        { name: "AUDITORIA E ESTRUTURA DE BALANÇO", code: "EAER0035", hours: 60, type: "eng_specific", req: [] },
        { name: "PESQUISA OPERACIONAL", code: "EAER0036", hours: 60, type: "eng_specific", req: [] },
        { name: "DIREITO AMBIENTAL E RESPONSABILIDADE SOCIAL", code: "EAER0037", hours: 30, type: "eng_specific", req: [] },
        { name: "DIREITO AERONÁUTICO E ESPACIAL", code: "EAER0038", hours: 60, type: "eng_specific", req: [] },
        { name: "DIREITO INTERNACIONAL", code: "EAER0039", hours: 60, type: "eng_specific", req: [] },
        { name: "TÓPICOS EM GOVERNANÇA, GESTÃO E EMPREENDEDORISMO AEROESPACIAL", code: "EAER0040", hours: 60, type: "eng_specific", req: [] },
        { name: "PROJETO DE MOTOR FOGUETE À PROPULSÃO SÓLIDA (MFPS)", code: "EAER0041", hours: 60, type: "eng_specific", req: [] },
        { name: "PROJETO DE MOTOR FOGUETE À PROPULSÃO LÍQUIDA (MFPL)", code: "EAER0042", hours: 60, type: "eng_specific", req: [] },
        { name: "ANÁLISE NUMÉRICA PARA ESTRUTURAS", code: "EAER0043", hours: 60, type: "eng_specific", req: [] },
        { name: "TÓPICOS EM CIÊNCIAS E ENGENHARIA AERONÁUTICA", code: "EAER0044", hours: 60, type: "eng_specific", req: [] },
        { name: "AVIÔNICA", code: "EAER0045", hours: 60, type: "eng_specific", req: [] },
        { name: "LIBRAS", code: "EAER0046", hours: 60, type: "eng_specific", req: [] },
        { name: "RELAÇÕES ÉTNICO-RACIAIS", code: "EAER0047", hours: 60, type: "eng_specific", req: [] },
        { name: "HISTÓRIA AFRO-BRASILEIRA E AFRICANA", code: "EAER0048", hours: 60, type: "eng_specific", req: [] },
        { name: "ÉTICA E CIDADANIA", code: "EAER0049", hours: 60, type: "eng_specific", req: [] },
      ]
    }
  ]
};

// ============================================================
// EXPORT CENTRAL
// ============================================================
export const engineeringTracks = {
  computacao: computacaoData,
  civil: civilData,
  mecanica: mecanicaData,
  ambiental: ambientalData,
  aeroespacial: aeroespacialData,
};

export const trackList = [
  computacaoData,
  civilData,
  mecanicaData,
  ambientalData,
  aeroespacialData,
];
