import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Plus, Edit, Images } from "lucide-react";
import DeleteGaleriaButton from "./DeleteGaleriaButton";

const prisma = new PrismaClient();

export default async function AdminGaleriasPage() {
  const galerias = await prisma.galeria.findMany({
    orderBy: {
      criadoEm: 'desc'
    },
    include: {
      criador: true,
      _count: {
        select: { imagens: true }
      }
    }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Galerias</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Crie álbuns de fotos para usar nas Notícias e Páginas.</p>
        </div>
        <Link 
          href="/admin/galerias/form"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Galeria
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {galerias.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
            <Images className="w-12 h-12 text-gray-300 dark:text-slate-700 mb-4" />
            <p>Nenhuma galeria encontrada. Crie a primeira!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Título</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Imagens</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Criador</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Status</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {galerias.map((galeria) => (
                  <tr key={galeria.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{galeria.titulo}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(galeria.criadoEm).toLocaleDateString('pt-BR')}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400 px-2.5 py-1 rounded-md font-medium">
                        {galeria._count.imagens} fotos
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      {galeria.criador.nome}
                    </td>
                    <td className="p-4">
                      {galeria.publicada ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Pública
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Rascunho
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link 
                        href={`/admin/galerias/form/${galeria.id}`} 
                        className="inline-flex p-2 text-gray-400 hover:text-amber-500 transition-colors rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeleteGaleriaButton id={galeria.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
