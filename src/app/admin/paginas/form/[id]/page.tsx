import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PaginaForm from "../PaginaForm";

export const metadata = {
  title: "Editar Página | Admin BICT",
};

export default async function EditarPaginaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const pagina = await db.pagina.findUnique({
    where: { id },
    include: { secoes: true }
  });

  if (!pagina) {
    notFound();
  }

  // Prepara os dados para o formulário
  const initialData = {
    id: pagina.id,
    titulo: pagina.titulo,
    descricao: pagina.descricao || "",
    publicada: pagina.publicada,
    secoes: pagina.secoes.map(s => ({
      id: s.id,
      tipo: s.tipo as "TEXTO" | "BANNER" | "NOTICIAS" | "AVISOS",
      titulo: s.titulo,
      conteudo: s.conteudo,
      ordem: s.ordem,
    })),
  };

  return (
    <main className="p-4 md:p-8 h-full">
      <PaginaForm initialData={initialData} />
    </main>
  );
}
