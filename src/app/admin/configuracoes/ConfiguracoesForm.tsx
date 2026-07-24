"use client";

import { useState } from "react";
import { saveConfiguracoes } from "./actions";
import { Save, Loader2, Palette, Layout, ShieldCheck, Share2, MessageCircle, Layers, Plus, Trash2 } from "lucide-react";
import { HeaderConfig, FooterConfig, LoginConfig, SocialLinkConfig, WhatsAppConfig, DEFAULT_SOCIAL_LINKS } from "@/types/cms";
import { LandingPageConfig } from "@/types/landing-page";
import { CustomNavManager } from "@/components/admin/CustomNavManager";
import { LandingPageBlockEditor } from "@/components/admin/cms/LandingPageBlockEditor";
import { SocialLinks } from "@/components/shared/SocialLinks";

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
  
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
    ...initHeader,
    showSocialLinks: initHeader.showSocialLinks ?? true
  });
  const [footerConfig, setFooterConfig] = useState<FooterConfig>({
    ...initFooter,
    showSocialLinks: initFooter.showSocialLinks ?? true,
    colunas: initFooter.colunas || []
  });
  const [loginConfig, setLoginConfig] = useState<LoginConfig>(initLogin);
  
  // Garantir que todas as 9 redes existam na lista
  const mergeSocialLinks = (): SocialLinkConfig[] => {
    const safeInit = Array.isArray(initSocial) ? initSocial : [];
    return DEFAULT_SOCIAL_LINKS.map((defaultItem) => {
      const existing = safeInit.find((item) => item.platform === defaultItem.platform);
      return existing ? { ...defaultItem, ...existing } : defaultItem;
    });
  };

  const [socialLinks, setSocialLinks] = useState<SocialLinkConfig[]>(mergeSocialLinks());
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

  const handleSocialToggle = (id: string, enabled: boolean) => {
    setSocialLinks(socialLinks.map((s) => (s.id === id ? { ...s, enabled } : s)));
  };

  const handleSocialUrlChange = (id: string, url: string) => {
    setSocialLinks(socialLinks.map((s) => (s.id === id ? { ...s, url } : s)));
  };

  const handleAddFooterColumn = () => {
    const newCol = {
      id: Date.now().toString(),
      titulo: "Nova Coluna",
      links: []
    };
    setFooterConfig({ ...footerConfig, colunas: [...footerConfig.colunas, newCol] });
  };

  const handleUpdateFooterColumnTitle = (id: string, titulo: string) => {
    setFooterConfig({
      ...footerConfig,
      colunas: footerConfig.colunas.map((col) => (col.id === id ? { ...col, titulo } : col))
    });
  };

  const handleRemoveFooterColumn = (id: string) => {
    setFooterConfig({
      ...footerConfig,
      colunas: footerConfig.colunas.filter((col) => col.id !== id)
    });
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
        <div className={`p-4 rounded-xl border text-xs font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400'}`}>
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
          <Palette className="w-4 h-4" /> Geral & Tema
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
          <Share2 className="w-4 h-4" /> Rodapé (Footer)
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
            
            <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <input
                type="checkbox"
                id="header-show-social"
                checked={headerConfig.showSocialLinks ?? true}
                onChange={(e) => setHeaderConfig({ ...headerConfig, showSocialLinks: e.target.checked })}
                className="h-4 w-4 rounded text-primary cursor-pointer"
              />
              <label htmlFor="header-show-social" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Exibir Ícones de Redes Sociais no Cabeçalho
              </label>
            </div>

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
              title="Links do Menu Principal (Header)"
              links={headerConfig.links}
              onChange={(newLinks) => setHeaderConfig({ ...headerConfig, links: newLinks })}
            />
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Configuração do Rodapé (Footer)</h2>
            
            <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <input
                type="checkbox"
                id="footer-show-social"
                checked={footerConfig.showSocialLinks ?? true}
                onChange={(e) => setFooterConfig({ ...footerConfig, showSocialLinks: e.target.checked })}
                className="h-4 w-4 rounded text-primary cursor-pointer"
              />
              <label htmlFor="footer-show-social" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Exibir Ícones de Redes Sociais no Rodapé
              </label>
            </div>

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

            {/* Gerenciador de Colunas do Rodapé */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Colunas de Links do Rodapé ({footerConfig.colunas.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddFooterColumn}
                  className="px-3 py-1.5 bg-primary text-white rounded-xl font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Adicionar Coluna
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {footerConfig.colunas.map((col) => (
                  <div key={col.id} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={col.titulo}
                        onChange={(e) => handleUpdateFooterColumnTitle(col.id, e.target.value)}
                        placeholder="Título da Coluna"
                        className="px-3 py-1.5 font-bold text-xs rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFooterColumn(col.id)}
                        className="p-1.5 text-red-500 hover:text-red-700"
                        title="Excluir Coluna"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <CustomNavManager
                      title={`Links de "${col.titulo}"`}
                      links={col.links}
                      onChange={(newLinks) => {
                        setFooterConfig({
                          ...footerConfig,
                          colunas: footerConfig.colunas.map((c) => (c.id === col.id ? { ...c, links: newLinks } : c))
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Gerenciador de Redes Sociais</h2>

            {/* Preview das Redes Sociais */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview dos Ícones Ativos</h3>
              <SocialLinks links={socialLinks} showLabels />
            </div>

            {/* Lista das 9 Redes Sociais */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Configuração Individual das Redes Sociais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialLinks.map((social) => (
                  <div
                    key={social.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SocialLinks links={[social]} />
                        <span className="font-bold text-xs uppercase text-slate-800 dark:text-slate-200">
                          {social.platform}
                        </span>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={social.enabled}
                          onChange={(e) => handleSocialToggle(social.id, e.target.checked)}
                          className="h-4 w-4 rounded text-primary cursor-pointer"
                        />
                        <span className={`text-xs font-bold ${social.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {social.enabled ? 'Ativo' : 'Inativo'}
                        </span>
                      </label>
                    </div>

                    <input
                      type="text"
                      value={social.url}
                      onChange={(e) => handleSocialUrlChange(social.id, e.target.value)}
                      placeholder={`URL do ${social.platform} (https://...)`}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-200"
                    />
                  </div>
                ))}
              </div>
            </div>

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
