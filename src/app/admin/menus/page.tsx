import { db } from "@/lib/db";
import MenuList from "./MenuList";

export const metadata = {
  title: "Gerenciar Menus | Admin BICT",
};

export default async function MenusPage() {
  // Seleciona o menu a ser exibido tentando priorizar menus que
  // contenham itens principais (parentId == null). Estratégia:
  // 1) tenta 'publico', 2) tenta 'principal', 3) escolhe o primeiro menu que tenha raiz,
  // 4) por fim, qualquer menu disponível.
  // Carrega todos os itens de todos os menus sem limite, para exibição em uma única página.
  const itens = await db.menuItem.findMany({
    orderBy: [
      { parentId: 'asc' },
      { ordem: 'asc' }
    ],
    include: {
      parent: {
        select: { label: true }
      }
    }
  });

  return (
    <main className="p-4 md:p-8 h-full max-w-7xl mx-auto flex flex-col">
      <MenuList initialItems={itens} />
    </main>
  );
}
