import { db } from "@/lib/db";
import Link from "next/link";
import { Menu } from "lucide-react";

export default async function Header() {
  const configuracoes = await db.configuracao.findMany();
  const logo = configuracoes.find(c => c.chave === "logo_url")?.valor || "BICT";
  
  const menuPublico = await db.menu.findUnique({
    where: { nome: "publico" },
    include: { itens: { orderBy: { ordem: 'asc' } } }
  });

  return (
    <header className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          {logo}
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6">
          {menuPublico?.itens.map(item => (
            <Link key={item.id} href={item.url} className="text-gray-600 hover:text-blue-600">
              {item.label}
            </Link>
          ))}
          {!menuPublico?.itens.length && (
            <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          )}
        </nav>

        {/* Mobile Menu Button - precisa de client component ou state depois */}
        <button className="md:hidden text-gray-600">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
