// ============================================================
// Dados Curriculares - BICT UFMA (Matriz 2022)
// 4 ênfases: NT1 Civil | NT2 Mecânica | NT3 Ambiental | NT4 Computação
// ============================================================

// ---- TIPO DE CONFIGURAÇÃO DE CORES / LABELS ----
export const typeConfig = {
  bict_mandatory:             { label: "Obrigatória BICT",            bg: "bg-amber-100/70",   text: "text-amber-900",   border: "border-amber-400"   },
  bict_elective:              { label: "Optativa BICT",               bg: "bg-blue-100/70",    text: "text-blue-900",    border: "border-blue-400"    },
  eng_specific:               { label: "Específica da Engenharia",    bg: "bg-emerald-100/70", text: "text-emerald-900", border: "border-emerald-400" },
  complementary:              { label: "Ativ. Complementares / TCC",  bg: "bg-rose-100/70",    text: "text-rose-900",    border: "border-rose-400"    },
  second_cycle_placeholder:   { label: "2º Ciclo (a cadastrar)",      bg: "bg-slate-100/70",   text: "text-slate-500",   border: "border-dashed border-slate-300" },
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
  semesters: [
    {
      semester: 1, phase: "bict", totalHours: 360,
      courses: [
        { name: "Ciência, Tecnologia e Sociedade",    code: "CCCT0007", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Diferencial",                code: "CCCT0091", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Vetores e Geometria Analítica",      code: "CCCT0093", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Desenho Computacional",              code: "CCCT0002", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Meio Ambiente e Sustentabilidade",   code: "CCCT0012", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Química Geral e Inorgânica",         code: "CCCT0004", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Práticas de Leitura e Escrita",      code: "CCCT0092", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 2, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fundamentos de Computação",          code: "CCCT0006", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Integral",                   code: "CCCT0096", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Álgebra Linear",                     code: "CCCT0095", hours: 60, type: "bict_mandatory", req: ["CCCT0093"] },
        { name: "Fenômenos Mecânicos",                code: "CCCT0011", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Administração e Economia",           code: "CCCT0094", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Química Experimental",               code: "CCCT0005", hours: 30, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Fundamentos de Segurança no Trabalho", code: "CCCT0027", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Metodologia da Pesquisa Científica", code: "CCCT0003", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 3, phase: "bict", totalHours: 390,
      courses: [
        { name: "Física Experimental I",                    code: "CCCT0017", hours: 30,  type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Introdução à Probabilidade e Estatística", code: "CCCT0097", hours: 60,  type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Oscilações, Ondas e Óptica",               code: "CCCT0098", hours: 60,  type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Funções de Várias Variáveis",              code: "CCCT0128", hours: 90,  type: "bict_mandatory", req: ["CCCT0096","CCCT0095"] },
        { name: "Ciência e Tecnologia dos Materiais",       code: "CCCT0019", hours: 60,  type: "bict_elective",  req: [] },
        { name: "Mecânica dos Fluídos",                     code: "CCCT0023", hours: 60,  type: "bict_elective",  req: ["CCCT0011"] },
        { name: "Laboratório de Programação",               code: "CCCT0102", hours: 30,  type: "bict_elective",  req: ["CCCT0006"] },
      ]
    },
    {
      semester: 4, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fenômenos Eletromagnéticos",           code: "CCCT0018", hours: 60, type: "bict_mandatory", req: ["CCCT0098"] },
        { name: "Cálculo Numérico",                     code: "CCCT0022", hours: 60, type: "bict_mandatory", req: ["CCCT0096"] },
        { name: "Física Experimental II",               code: "CCCT0025", hours: 30, type: "bict_mandatory", req: ["CCCT0017"] },
        { name: "Equações Diferenciais Ordinárias I",   code: "CCCT0099", hours: 60, type: "bict_mandatory", req: ["CCCT0128"] },
        { name: "Mecânica dos Sólidos",                 code: "CCCT0024", hours: 60, type: "bict_elective",  req: ["CCCT0011"] },
        { name: "Eletricidade Aplicada",                code: "CCCT0026", hours: 60, type: "bict_elective",  req: ["CCCT0018"] },
        { name: "Algoritmos e Estrutura de Dados I",    code: "CCCT0103", hours: 60, type: "bict_elective",  req: ["CCCT0006"] },
      ]
    },
    {
      semester: 5, phase: "bict", totalHours: 360,
      courses: [
        { name: "Eletrônica Aplicada",              code: "EECP0001", hours: 60,  type: "eng_specific", req: ["CCCT0026"] },
        { name: "Circuitos Digitais",               code: "EECP0002", hours: 60,  type: "eng_specific", req: [] },
        { name: "Engenharia de Software",           code: "EECP0003", hours: 60,  type: "eng_specific", req: ["CCCT0103"] },
        { name: "Banco de Dados",                   code: "EECP0004", hours: 90,  type: "eng_specific", req: ["CCCT0103"] },
        { name: "Paradigmas de Programação",        code: "EECP0005", hours: 90,  type: "eng_specific", req: ["CCCT0103"] },
      ]
    },
    {
      semester: 6, phase: "bict", totalHours: 510,
      courses: [
        { name: "Laboratório de Eletrônica Aplicada",       code: "EECP0006", hours: 60, type: "eng_specific", req: ["EECP0001"] },
        { name: "Laboratório de Circuitos Digitais",        code: "EECP0007", hours: 60, type: "eng_specific", req: ["EECP0002"] },
        { name: "Inteligência Artificial",                  code: "EECP0008", hours: 60, type: "eng_specific", req: ["CCCT0103"] },
        { name: "Arquitetura de Computadores",              code: "EECP0009", hours: 60, type: "eng_specific", req: ["EECP0002"] },
        { name: "Sistemas Operacionais",                    code: "EECP0010", hours: 60, type: "eng_specific", req: ["CCCT0103"] },
        { name: "Projeto e Desenvolvimento de Software",    code: "EECP0011", hours: 60, type: "eng_specific", req: ["EECP0003"] },
        { name: "Atividades Complementares BICT",           code: "CCCT0089", hours: 90, type: "complementary", req: [] },
        { name: "Trabalho de Conclusão de Curso BICT",      code: "CCCT0100", hours: 60, type: "complementary", req: [] },
      ]
    },
    // ==== SEGUNDO CICLO - Engenharia de Computação ====
    {
      semester: 7, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "Instrumentação",                                   code: "EECP0012", hours: 60, type: "eng_specific", req: ["EECP0006"] },
        { name: "Análise de Sistemas Lineares",                     code: "EECP0013", hours: 90, type: "eng_specific", req: ["CCCT0128"] },
        { name: "Computação Gráfica",                               code: "EECP0014", hours: 60, type: "eng_specific", req: ["EECP0005"] },
        { name: "Lógica e Matemática Discreta",                     code: "EECP0015", hours: 60, type: "eng_specific", req: [] },
        { name: "Comunicação de Dados e Redes de Computadores",     code: "EECP0016", hours: 90, type: "eng_specific", req: ["EECP0010"] },
      ]
    },
    {
      semester: 8, phase: "second_cycle", totalHours: 360,
      courses: [
        { name: "Engenharia de Controle",           code: "EECP0017", hours: 90, type: "eng_specific", req: ["EECP0012","EECP0013"] },
        { name: "Processamento Digital de Sinais",  code: "EECP0018", hours: 90, type: "eng_specific", req: ["EECP0013"] },
        { name: "Métodos Formais",                  code: "EECP0019", hours: 60, type: "eng_specific", req: ["EECP0015"] },
        { name: "Linguagens Formais e Autômatos",   code: "EECP0020", hours: 60, type: "eng_specific", req: ["EECP0015"] },
        { name: "Sistemas Distribuídos",            code: "EECP0021", hours: 60, type: "eng_specific", req: ["EECP0016"] },
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
  ]
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
        { name: "Ciência, Tecnologia e Sociedade",  code: "CCCT0007", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Diferencial",              code: "CCCT0091", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Vetores e Geometria Analítica",    code: "CCCT0093", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Desenho Computacional",            code: "CCCT0002", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Meio Ambiente e Sustentabilidade", code: "CCCT0012", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Química Geral e Inorgânica",       code: "CCCT0004", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Práticas de Leitura e Escrita",    code: "CCCT0092", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 2, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fundamentos de Computação",          code: "CCCT0006", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Integral",                   code: "CCCT0096", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Álgebra Linear",                     code: "CCCT0095", hours: 60, type: "bict_mandatory", req: ["CCCT0093"] },
        { name: "Fenômenos Mecânicos",                code: "CCCT0011", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Administração e Economia",           code: "CCCT0094", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Química Experimental",               code: "CCCT0005", hours: 30, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Fundamentos de Segurança no Trabalho", code: "CCCT0027", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Metodologia da Pesquisa Científica", code: "CCCT0003", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 3, phase: "bict", totalHours: 390,
      courses: [
        { name: "Física Experimental I",                    code: "CCCT0017", hours: 30, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Introdução à Probabilidade e Estatística", code: "CCCT0097", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Oscilações, Ondas e Óptica",               code: "CCCT0098", hours: 60, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Funções de Várias Variáveis",              code: "CCCT0128", hours: 90, type: "bict_mandatory", req: ["CCCT0096","CCCT0095"] },
        { name: "Ciência e Tecnologia dos Materiais",       code: "CCCT0019", hours: 60, type: "bict_elective",  req: [] },
        { name: "Físico-Química Fundamental",               code: "CCCT0020", hours: 30, type: "bict_elective",  req: ["CCCT0004"] },
        { name: "Fundamentos de Química Orgânica e Biotecnologia", code: "CCCT0021", hours: 60, type: "bict_elective", req: ["CCCT0004"] },
      ]
    },
    {
      semester: 4, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fenômenos Eletromagnéticos",         code: "CCCT0018", hours: 60, type: "bict_mandatory", req: ["CCCT0098"] },
        { name: "Cálculo Numérico",                   code: "CCCT0022", hours: 60, type: "bict_mandatory", req: ["CCCT0096"] },
        { name: "Física Experimental II",             code: "CCCT0025", hours: 30, type: "bict_mandatory", req: ["CCCT0017"] },
        { name: "Equações Diferenciais Ordinárias I", code: "CCCT0099", hours: 60, type: "bict_mandatory", req: ["CCCT0128"] },
        { name: "Mecânica dos Fluídos",               code: "CCCT0023", hours: 60, type: "bict_elective",  req: ["CCCT0011"] },
        { name: "Mecânica dos Sólidos",               code: "CCCT0024", hours: 60, type: "bict_elective",  req: ["CCCT0011"] },
        { name: "Eletricidade Aplicada",              code: "CCCT0026", hours: 60, type: "bict_elective",  req: ["CCCT0018"] },
      ]
    },
    {
      semester: 5, phase: "bict", totalHours: 360,
      courses: [
        { name: "Desenho para Engenharias",                 code: "CCEC0001", hours: 60, type: "eng_specific", req: ["CCCT0002"] },
        { name: "Análise de Estruturas I",                  code: "CCEC0002", hours: 60, type: "eng_specific", req: ["CCCT0024"] },
        { name: "Geologia",                                 code: "CCEC0003", hours: 60, type: "eng_specific", req: [] },
        { name: "Materiais de Construção I",                code: "CCEC0004", hours: 60, type: "eng_specific", req: [] },
        { name: "Fundamentos de Resistência de Materiais",  code: "CCEC0005", hours: 60, type: "eng_specific", req: ["CCCT0024"] },
        { name: "Hidráulica I",                             code: "CCEC0006", hours: 60, type: "eng_specific", req: ["CCCT0023"] },
      ]
    },
    {
      semester: 6, phase: "bict", totalHours: 510,
      courses: [
        { name: "Materiais de Construção II",       code: "CCEC0008", hours: 60, type: "eng_specific", req: ["CCEC0004"] },
        { name: "Topografia",                       code: "CCEC0009", hours: 60, type: "eng_specific", req: [] },
        { name: "Mecânica dos Solos",               code: "CCEC0010", hours: 60, type: "eng_specific", req: ["CCEC0003"] },
        { name: "Construção Civil I",               code: "CCEC0011", hours: 60, type: "eng_specific", req: [] },
        { name: "Estrutura do Concreto Armado I",   code: "CCEC0012", hours: 60, type: "eng_specific", req: ["CCEC0002"] },
        { name: "Hidrologia",                       code: "CCEC0013", hours: 60, type: "eng_specific", req: ["CCEC0006"] },
        { name: "Atividades Complementares BICT",   code: "CCCT0089", hours: 90, type: "complementary", req: [] },
        { name: "Trabalho de Conclusão de Curso BICT", code: "CCCT0100", hours: 60, type: "complementary", req: [] },
      ]
    },
    {
      semester: 7, phase: "second_cycle", totalHours: 0, isPlaceholder: true,
      courses: [
        { name: "Disciplinas do 2º Ciclo (a cadastrar)", code: "EC_P7", hours: 0, type: "second_cycle_placeholder", req: [] },
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
        { name: "Ciência, Tecnologia e Sociedade",  code: "CCCT0007", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Diferencial",              code: "CCCT0091", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Vetores e Geometria Analítica",    code: "CCCT0093", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Desenho Computacional",            code: "CCCT0002", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Meio Ambiente e Sustentabilidade", code: "CCCT0012", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Química Geral e Inorgânica",       code: "CCCT0004", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Práticas de Leitura e Escrita",    code: "CCCT0092", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 2, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fundamentos de Computação",          code: "CCCT0006", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Integral",                   code: "CCCT0096", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Álgebra Linear",                     code: "CCCT0095", hours: 60, type: "bict_mandatory", req: ["CCCT0093"] },
        { name: "Fenômenos Mecânicos",                code: "CCCT0011", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Administração e Economia",           code: "CCCT0094", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Química Experimental",               code: "CCCT0005", hours: 30, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Fundamentos de Segurança no Trabalho", code: "CCCT0027", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Metodologia da Pesquisa Científica", code: "CCCT0003", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 3, phase: "bict", totalHours: 390,
      courses: [
        { name: "Física Experimental I",                    code: "CCCT0017", hours: 30, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Introdução à Probabilidade e Estatística", code: "CCCT0097", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Oscilações, Ondas e Óptica",               code: "CCCT0098", hours: 60, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Funções de Várias Variáveis",              code: "CCCT0128", hours: 90, type: "bict_mandatory", req: ["CCCT0096","CCCT0095"] },
        { name: "Ciência e Tecnologia dos Materiais",       code: "CCCT0019", hours: 60, type: "bict_elective",  req: [] },
        { name: "Empreendedorismo e Inovação",              code: "CCCT0034", hours: 60, type: "bict_elective",  req: [] },
        { name: "Laboratório de Programação",               code: "CCCT0102", hours: 30, type: "bict_elective",  req: ["CCCT0006"] },
      ]
    },
    {
      semester: 4, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fenômenos Eletromagnéticos",         code: "CCCT0018", hours: 60, type: "bict_mandatory", req: ["CCCT0098"] },
        { name: "Cálculo Numérico",                   code: "CCCT0022", hours: 60, type: "bict_mandatory", req: ["CCCT0096"] },
        { name: "Física Experimental II",             code: "CCCT0025", hours: 30, type: "bict_mandatory", req: ["CCCT0017"] },
        { name: "Equações Diferenciais Ordinárias I", code: "CCCT0099", hours: 60, type: "bict_mandatory", req: ["CCCT0128"] },
        { name: "Mecânica dos Fluídos",               code: "CCCT0023", hours: 60, type: "bict_elective",  req: ["CCCT0011"] },
        { name: "Mecânica dos Sólidos",               code: "CCCT0024", hours: 60, type: "bict_elective",  req: ["CCCT0011"] },
        { name: "Eletricidade Aplicada",              code: "CCCT0026", hours: 60, type: "bict_elective",  req: ["CCCT0018"] },
      ]
    },
    {
      semester: 5, phase: "bict", totalHours: 390,
      courses: [
        { name: "Resistência dos Materiais I",    code: "CCEM0001", hours: 60, type: "eng_specific", req: ["CCCT0024"] },
        { name: "Dinâmica",                       code: "CCEM0002", hours: 60, type: "eng_specific", req: ["CCCT0011"] },
        { name: "Desenho de Máquinas",            code: "CCEM0003", hours: 30, type: "eng_specific", req: ["CCCT0002"] },
        { name: "Mecânica dos Fluídos II",        code: "CCEM0004", hours: 60, type: "eng_specific", req: ["CCCT0023"] },
        { name: "Termodinâmica Aplicada",         code: "CCEM0005", hours: 60, type: "eng_specific", req: ["CCCT0011"] },
        { name: "Materiais para Engenharia",      code: "CCEM0006", hours: 60, type: "eng_specific", req: ["CCCT0019"] },
        { name: "Máquinas Elétricas",             code: "CCEM0007", hours: 60, type: "eng_specific", req: ["CCCT0018"] },
      ]
    },
    {
      semester: 6, phase: "bict", totalHours: 540,
      courses: [
        { name: "Resistência dos Materiais II",       code: "CCEM0008", hours: 60, type: "eng_specific", req: ["CCEM0001"] },
        { name: "Modelagem de Sistemas Mecânicos",    code: "CCEM0009", hours: 60, type: "eng_specific", req: ["CCEM0001"] },
        { name: "Mecanismos",                         code: "CCEM0010", hours: 45, type: "eng_specific", req: ["CCEM0002"] },
        { name: "Transferência de Calor I",           code: "CCEM0011", hours: 60, type: "eng_specific", req: ["CCEM0005"] },
        { name: "Máquinas Térmicas",                  code: "CCEM0012", hours: 60, type: "eng_specific", req: ["CCEM0005"] },
        { name: "Processo de Fabricação Mecânica I",  code: "CCEM0013", hours: 60, type: "eng_specific", req: [] },
        { name: "Laboratório de Materiais",           code: "CCEM0014", hours: 45, type: "eng_specific", req: ["CCEM0006"] },
        { name: "Atividades Complementares BICT",     code: "CCCT0089_M", hours: 90, type: "complementary", req: [] },
        { name: "Trabalho de Conclusão de Curso BICT", code: "CCCT0100_M", hours: 60, type: "complementary", req: [] },
      ]
    },
    {
      semester: 7, phase: "second_cycle", totalHours: 0, isPlaceholder: true,
      courses: [
        { name: "Disciplinas do 2º Ciclo (a cadastrar)", code: "EM_P7", hours: 0, type: "second_cycle_placeholder", req: [] },
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
        { name: "Ciência, Tecnologia e Sociedade",  code: "CCCT0007", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Diferencial",              code: "CCCT0091", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Vetores e Geometria Analítica",    code: "CCCT0093", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Desenho Computacional",            code: "CCCT0002", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Meio Ambiente e Sustentabilidade", code: "CCCT0012", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Química Geral e Inorgânica",       code: "CCCT0004", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Práticas de Leitura e Escrita",    code: "CCCT0092", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 2, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fundamentos de Computação",          code: "CCCT0006", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Cálculo Integral",                   code: "CCCT0096", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Álgebra Linear",                     code: "CCCT0095", hours: 60, type: "bict_mandatory", req: ["CCCT0093"] },
        { name: "Fenômenos Mecânicos",                code: "CCCT0011", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Administração e Economia",           code: "CCCT0094", hours: 60, type: "bict_mandatory", req: [] },
        { name: "Química Experimental",               code: "CCCT0005", hours: 30, type: "bict_mandatory", req: ["CCCT0004"] },
        { name: "Fundamentos de Segurança no Trabalho", code: "CCCT0027", hours: 30, type: "bict_mandatory", req: [] },
        { name: "Metodologia da Pesquisa Científica", code: "CCCT0003", hours: 30, type: "bict_mandatory", req: [] },
      ]
    },
    {
      semester: 3, phase: "bict", totalHours: 390,
      courses: [
        { name: "Física Experimental I",                    code: "CCCT0017", hours: 30, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Introdução à Probabilidade e Estatística", code: "CCCT0097", hours: 60, type: "bict_mandatory", req: ["CCCT0091"] },
        { name: "Oscilações, Ondas e Óptica",               code: "CCCT0098", hours: 60, type: "bict_mandatory", req: ["CCCT0011"] },
        { name: "Funções de Várias Variáveis",              code: "CCCT0128", hours: 90, type: "bict_mandatory", req: ["CCCT0096","CCCT0095"] },
        { name: "Ciência e Tecnologia dos Materiais",       code: "CCCT0019", hours: 60, type: "bict_elective",  req: [] },
        { name: "Físico-Química Fundamental",               code: "CCCT0020", hours: 30, type: "bict_elective",  req: ["CCCT0004"] },
        { name: "Fundamentos de Química Orgânica e Biotecnologia", code: "CCCT0021", hours: 60, type: "bict_elective", req: ["CCCT0004"] },
      ]
    },
    {
      semester: 4, phase: "bict", totalHours: 390,
      courses: [
        { name: "Fenômenos Eletromagnéticos",         code: "CCCT0018", hours: 60, type: "bict_mandatory", req: ["CCCT0098"] },
        { name: "Cálculo Numérico",                   code: "CCCT0022", hours: 60, type: "bict_mandatory", req: ["CCCT0096"] },
        { name: "Física Experimental II",             code: "CCCT0025", hours: 30, type: "bict_mandatory", req: ["CCCT0017"] },
        { name: "Equações Diferenciais Ordinárias I", code: "CCCT0099", hours: 60, type: "bict_mandatory", req: ["CCCT0128"] },
        { name: "Mecânica dos Fluídos",               code: "CCCT0023", hours: 60, type: "bict_elective",  req: ["CCCT0011"] },
        { name: "Mecânica dos Sólidos",               code: "CCCT0024", hours: 60, type: "bict_elective",  req: ["CCCT0011"] },
        { name: "Eletricidade Aplicada",              code: "CCCT0026", hours: 60, type: "bict_elective",  req: ["CCCT0018"] },
      ]
    },
    {
      semester: 5, phase: "bict", totalHours: 360,
      courses: [
        { name: "Microbiologia Ambiental",  code: "CCAS0025", hours: 60, type: "eng_specific", req: [] },
        { name: "Topografia",               code: "CCAS0026", hours: 60, type: "eng_specific", req: [] },
        { name: "Geologia",                 code: "CCAS0027", hours: 60, type: "eng_specific", req: [] },
        { name: "Materiais de Construção",  code: "CCAS0028", hours: 60, type: "eng_specific", req: [] },
        { name: "Hidráulica I",             code: "CCAS0029", hours: 60, type: "eng_specific", req: ["CCCT0023"] },
        { name: "Resistência dos Materiais",code: "CCAS0030", hours: 60, type: "eng_specific", req: ["CCCT0024"] },
      ]
    },
    {
      semester: 6, phase: "bict", totalHours: 510,
      courses: [
        { name: "Saúde Ambiental",                             code: "CCAS0031", hours: 60, type: "eng_specific", req: [] },
        { name: "Soluções Sanitárias Unidomiciliar Apropriada", code: "CCAS0032", hours: 60, type: "eng_specific", req: [] },
        { name: "Mecânica dos Solos",                          code: "CCAS0033", hours: 60, type: "eng_specific", req: ["CCAS0027"] },
        { name: "Construção Civil",                            code: "CCAS0034", hours: 60, type: "eng_specific", req: [] },
        { name: "Estrutura do Concreto Armado",                code: "CCAS0035", hours: 60, type: "eng_specific", req: [] },
        { name: "Hidráulica II",                               code: "CCAS0036", hours: 60, type: "eng_specific", req: ["CCAS0029"] },
        { name: "Atividades Complementares BICT",              code: "CCCT0089_A", hours: 90, type: "complementary", req: [] },
        { name: "Trabalho de Conclusão de Curso BICT",         code: "CCCT0100_A", hours: 60, type: "complementary", req: [] },
      ]
    },
    {
      semester: 7, phase: "second_cycle", totalHours: 0, isPlaceholder: true,
      courses: [
        { name: "Disciplinas do 2º Ciclo (a cadastrar)", code: "EA_P7", hours: 0, type: "second_cycle_placeholder", req: [] },
      ]
    },
  ]
};

// ============================================================
// EXPORT CENTRAL
// ============================================================
export const engineeringTracks = {
  computacao: computacaoData,
  civil:       civilData,
  mecanica:    mecanicaData,
  ambiental:   ambientalData,
};

export const trackList = [
  computacaoData,
  civilData,
  mecanicaData,
  ambientalData,
];
