import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import DeletePostButton from "./DeletePostButton"; // We'll create this client component

const prisma = new PrismaClient();

export default async function AdminNoticiasPage() {
  const posts = await prisma.post.findMany({
    orderBy: {
      criadoEm: 'desc'
    },
    include: {
      categoria: true,
      autor: true
    }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Notícias</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Crie e edite as publicações de notícias do BICT.</p>
        </div>
        <Link 
          href="/admin/noticias/form"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Notícia
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Nenhuma notícia encontrada. Crie a primeira!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Título</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Categoria</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Autor</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Status</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{post.titulo}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(post.criadoEm).toLocaleDateString('pt-BR')}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                        {post.categoria.nome}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      {post.autor.nome}
                    </td>
                    <td className="p-4">
                      {post.publicado ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Rascunho
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link 
                        href={`/noticias/${post.slug}`} 
                        target="_blank"
                        className="inline-flex p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/admin/noticias/form/${post.id}`} 
                        className="inline-flex p-2 text-gray-400 hover:text-amber-500 transition-colors rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <DeletePostButton id={post.id} />
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
