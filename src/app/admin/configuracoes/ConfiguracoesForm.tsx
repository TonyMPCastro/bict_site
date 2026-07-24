"use client";

import { useState } from "react";
import { saveConfiguracoes } from "./actions";
import { Save, Loader2, Palette, Layout, ShieldCheck, Share2, MessageCircle, Layers } from "lucide-react";
import { HeaderConfig, FooterConfig, LoginConfig, SocialLinkConfig, WhatsAppConfig } from "@/types/cms";
import { LandingPageConfig } from "@/types/landing-page";
import { CustomNavManager } from "@/components/admin/CustomNavManager";
import { LandingPageBlockEditor } from "@/components/admin/cms/LandingPageBlockEditor";

interface ConfiguracoesFormProps {
  initialData: Record<string, string>;
  headerConfig: HeaderConfig;
  footerConfig: FooterConfig;
  loginConfig: LoginConfig;
  socialLinks: SocialLinkConfig[];
  whatsAppConfig: WhatsAppConfig;
  homeLandingConfig: LandingPageConfig;
}

export default function ConfiguracoesForm({
  initialData,
  headerConfig: initHeader,
  footerConfig: initFooter,
  loginConfig: initLogin,
  socialLinks: initSocial,
  whatsAppConfig: initWA,
  homeLandingConfig: initHome
}: ConfiguracoesFormProps) {
  const [activeTab, setActiveTab] = useState<'geral' | 'header' | 'footer' | 'login' | 'social' | 'blocks'>('geral');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Estados dos módulos
  const [corPrimaria, setCorPrimaria] = useState(initialData.cor_primaria || "#2563eb");
  const [nomeSite, setNomeSite] = useState(initialData.nome_site || "BACHARELADO INTERDISCIPLINAR EM CIÊNCIA E TECNOLOGIA");
  
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(initHeader);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(initFooter);
  const [loginConfig, setLoginConfig] = useState<LoginConfig>(initLogin);
  const [socialLinks, setSocialLinks] = useState<SocialLinkConfig[]>(initSocial);
  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>(initWA);
  const [homeLandingConfig, setHomeLandingConfig] = useState<LandingPageConfig>(initHome);

  const handleSaveAll = async () => {
    setIsSaving(true);
    setMessage(null);

    const payload: Record<string, string> = {
      cor_primaria: corPrimaria,
      nome_site: nomeSite,
      header_config: JSON.stringify(headerConfig),
      footer_config: JSON.stringify(footerConfig),
      login_config: JSON.stringify(loginConfig),
      social_links_config: JSON.stringify(socialLinks),
      whatsapp_config: JSON.stringify(whatsAppConfig),
      home_landing_config: JSON.stringify(homeLandingConfig)
    };

    const result = await saveConfiguracoes(payload);

    if (result.success) {
      setMessage({ type: 'success', text: "Configurações salvas com sucesso!" });
    } else {
      setMessage({ type: 'error', text: result.error || "Erro ao salvar" });
    }

    setIsSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Painel CMS & Configurações</h1>
          <p className="text-sm text-slate-500">Personalize o tema, layouts, redes sociais e blocos da Landing Page</p>
        </div>

        <button 
          onClick={handleSaveAll}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Salvar Tudo</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Navegação por Abas */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('geral')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'geral' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Palette className="w-4 h-4" /> Identidade Geral
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'header' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Layout className="w-4 h-4" /> Cabeçalho (Header)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'footer' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Layout className="w-4 h-4" /> Rodapé (Footer)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('login')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'login' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Tela de Login
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'social' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <MessageCircle className="w-4 h-4" /> Redes & WhatsApp
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('blocks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'blocks' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" /> Construtora por Blocos
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {activeTab === 'geral' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Identidade Visual & Título</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Cor Primária do Site</label>
                <div className="flex gap-3 items-center">
                  <input 
                    type="color"
                    value={corPrimaria}
                    onChange={(e) => setCorPrimaria(e.target.value)}
                    className="w-12 h-10 p-1 bg-white dark:bg-slate-900 border rounded cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={corPrimaria}
                    onChange={(e) => setCorPrimaria(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nome/Título do Site</label>
                <input 
                  type="text"
                  value={nomeSite}
                  onChange={(e) => setNomeSite(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'header' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configuração do Cabeçalho (Header)</h2>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Layout do Cabeçalho</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(['standard', 'floating', 'institutional', 'compact', 'minimal'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setHeaderConfig({ ...headerConfig, layout: l })}
                    className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                      headerConfig.layout === l
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <CustomNavManager
              links={headerConfig.links}
              onChange={(newLinks) => setHeaderConfig({ ...headerConfig, links: newLinks })}
            />
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configuração do Rodapé (Footer)</h2>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Layout do Rodapé</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(['standard', 'minimal', 'institutional', 'floating', 'compact'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setFooterConfig({ ...footerConfig, layout: l })}
                    className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                      footerConfig.layout === l
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Texto de Copyright</label>
              <input
                type="text"
                value={footerConfig.copyrightText || ''}
                onChange={(e) => setFooterConfig({ ...footerConfig, copyrightText: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
              />
            </div>
          </div>
        )}

        {activeTab === 'login' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configuração da Tela de Login</h2>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Layout da Tela de Login</label>
              <div className="grid grid-cols-3 gap-3">
                {(['split-left', 'split-right', 'centered'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLoginConfig({ ...loginConfig, layout: l })}
                    className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                      loginConfig.layout === l
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Instruções aos Usuários (CPF/Matrícula)</label>
              <textarea
                rows={3}
                value={loginConfig.instructionText || ''}
                onChange={(e) => setLoginConfig({ ...loginConfig, instructionText: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-xs"
              />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Redes Sociais & Ação Suspensa WhatsApp</h2>

            {/* WhatsApp Floating Config */}
            <div className="space-y-4 border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> Botão Suspenso Flutuante do WhatsApp
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Exibe um botão flutuante suspenso com balão de atendimento rápido
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={whatsAppConfig.enabled}
                  onChange={(e) => setWhatsAppConfig({ ...whatsAppConfig, enabled: e.target.checked })}
                  className="h-5 w-5 rounded text-emerald-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold">Número de Telefone (com DDD)</label>
                  <input
                    type="text"
                    value={whatsAppConfig.phoneNumber || ''}
                    onChange={(e) => setWhatsAppConfig({ ...whatsAppConfig, phoneNumber: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border bg-white dark:bg-slate-900"
                    placeholder="5598988888888"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold">Nome do Atendente</label>
                  <input
                    type="text"
                    value={whatsAppConfig.attendantName || ''}
                    onChange={(e) => setWhatsAppConfig({ ...whatsAppConfig, attendantName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border bg-white dark:bg-slate-900"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold">Mensagem de Boas-vindas (Balão)</label>
                  <input
                    type="text"
                    value={whatsAppConfig.welcomeMessage || ''}
                    onChange={(e) => setWhatsAppConfig({ ...whatsAppConfig, welcomeMessage: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blocks' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Construtora de Landing Page por Blocos (Home)</h2>
            <LandingPageBlockEditor
              config={homeLandingConfig}
              onChange={(newConfig) => setHomeLandingConfig(newConfig)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
