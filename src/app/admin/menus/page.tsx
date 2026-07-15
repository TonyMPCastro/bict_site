import { db } from "@/lib/db";
import MenuList from "./MenuList";

export const metadata = {
  title: "Gerenciar Menus | Admin BICT",
};

export default async function MenusPage() {
  const menuPublico = await db.menu.findUnique({
    where: { nome: "publico" },
  });

  const itens = menuPublico ? await db.menuItem.findMany({
    where: { menuId: menuPublico.id },
    orderBy: [
      { parentId: 'asc' }, // nulls first (items principais)
      { ordem: 'asc' }
    ],
    include: {
      parent: {
        select: { label: true }
      }
    }
  }) : [];

  return (
    <main className="p-4 md:p-8 h-full max-w-7xl mx-auto flex flex-col">
      <MenuList initialItems={itens} />
    </main>
  );
}
