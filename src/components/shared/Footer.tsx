import { db } from "@/lib/db";

export default async function Footer() {
  const configuracoes = await db.configuracao.findMany();
  const footerInfo = configuracoes.find(c => c.chave === "footer_info")?.valor || "© 2026 BICT. Todos os direitos reservados.";

  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p>{footerInfo}</p>
      </div>
    </footer>
  );
}
