import { getConfiguracoes } from "./actions";
import ConfiguracoesForm from "./ConfiguracoesForm";

export const metadata = {
  title: "Configurações | Admin BICT",
};

export default async function ConfiguracoesPage() {
  const configs = await getConfiguracoes();

  return (
    <main className="p-4 md:p-8 h-full">
      <ConfiguracoesForm initialData={configs} />
    </main>
  );
}
