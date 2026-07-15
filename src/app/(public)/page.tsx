import Link from "next/link";
import { ArrowRight, BookOpen, Layers, ShieldCheck, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 dark:from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl -z-10 opacity-50"></div>

        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-fadeInUp">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Plataforma Acadêmica Modernizada
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Bacharelado Interdisciplinar em <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Ciência e Tecnologia
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Gerencie sua trajetória acadêmica, acesse grades curriculares interativas e conecte-se com as engenharias do futuro em um só lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <Link 
              href="/engenharias" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              Ver Grades Curriculares
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Tudo o que você precisa</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Nossa plataforma foi desenhada para centralizar informações vitais e facilitar a vida de estudantes e professores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Cpu className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Grades Dinâmicas</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Visualize os pré-requisitos, planeje seus semestres e interaja com os componentes curriculares em tempo real.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Multidisciplinar</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Acesse facilmente informações sobre todas as engenharias pós-BICT e direcione seu curso para sua especialização.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Portal Seguro</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Sistema administrativo protegido e personalizável para que professores e coordenadores gerenciem o conteúdo.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 -z-10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 -z-10"></div>
        
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para organizar seus estudos?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
            Acesse o sistema com suas credenciais ou confira os materiais e ementas disponíveis publicamente.
          </p>
          <Link 
            href="/engenharias" 
            className="inline-flex px-8 py-4 bg-white text-blue-700 hover:bg-slate-50 font-bold rounded-full shadow-xl hover:-translate-y-1 transition-all"
          >
            Acessar Plataforma Agora
          </Link>
        </div>
      </section>

    </div>
  );
}
