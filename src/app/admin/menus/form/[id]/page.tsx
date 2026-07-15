import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import MenuForm from "../MenuForm";

export const metadata = {
  title: "Editar Menu | Admin BICT",
};

export default async function EditarMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const menuItem = await db.menuItem.findUnique({
    where: { id },
  });

  if (!menuItem) {
    notFound();
  }

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
      <MenuForm 
        initialData={menuItem} 
        paginas={paginas} 
        parentMenus={parentMenus} 
      />
    </main>
  );
}
