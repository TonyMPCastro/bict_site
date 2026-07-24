import { getConfiguracoes } from "./actions";
import { getCmsSettings } from "@/lib/cms-config";
import ConfiguracoesForm from "./ConfiguracoesForm";

export const metadata = {
  title: "Configurações & CMS | Admin BICT",
};

export default async function ConfiguracoesPage() {
  const configs = await getConfiguracoes();
  const cmsSettings = await getCmsSettings();

  return (
    <main className="p-4 md:p-8 h-full">
      <ConfiguracoesForm
        initialData={configs}
        headerConfig={cmsSettings.header}
        footerConfig={cmsSettings.footer}
        loginConfig={cmsSettings.login}
        socialLinks={cmsSettings.socialLinks}
        whatsAppConfig={cmsSettings.whatsApp}
        homeLandingConfig={cmsSettings.homeLanding}
      />
    </main>
  );
}
