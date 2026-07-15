import { db } from "@/lib/db";
import PaginasList from "./PaginasList";

export const metadata = {
  title: "Gerenciar Páginas | Admin BICT",
};

export default async function PaginasPage() {
  const paginas = await db.pagina.findMany({
    orderBy: { atualizadoEm: 'desc' },
    select: {
      id: true,
      titulo: true,
      slug: true,
      publicada: true,
      atualizadoEm: true,
    }
  });

  return (
    <main className="p-4 md:p-8 h-full max-w-7xl mx-auto flex flex-col">
      <PaginasList initialPaginas={paginas} />
    </main>
  );
}
