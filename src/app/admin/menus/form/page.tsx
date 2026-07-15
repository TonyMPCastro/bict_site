import { db } from "@/lib/db";
import MenuForm from "./MenuForm";

export const metadata = {
  title: "Novo Menu | Admin BICT",
};

export default async function NovoMenuPage() {
  const paginas = await db.pagina.findMany({
    where: { publicada: true },
    select: { id: true, titulo: true, slug: true }
  });

  const parentMenus = await db.menuItem.findMany({
    where: { parentId: null },
    select: { id: true, label: true }
  });

  return (
    <main className="p-4 md:p-8 h-full">
      <MenuForm paginas={paginas} parentMenus={parentMenus} />
    </main>
  );
}
