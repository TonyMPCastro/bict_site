"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Função para gerar slug amigável
function generateSlug(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export async function savePagina(data: {
  id?: string;
  titulo: string;
  descricao?: string | null;
  publicada: boolean;
  secoes: {
    id?: string;
    tipo: string;
    titulo?: string | null;
    conteudo: string;
    ordem: number;
  }[];
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const slug = generateSlug(data.titulo);

  try {
    if (data.id) {
      // Editar
      const pagina = await db.pagina.update({
        where: { id: data.id },
        data: {
          titulo: data.titulo,
          slug,
          descricao: data.descricao || null,
          publicada: data.publicada,
        }
      });

      // Puxa seções antigas para deletar as que não estão mais no array
      const existingSecoes = await db.secao.findMany({ where: { paginaId: data.id } });
      const incomingIds = data.secoes.filter(s => s.id).map(s => s.id);
      
      const toDelete = existingSecoes.filter(s => !incomingIds.includes(s.id));
      for (const del of toDelete) {
        await db.secao.delete({ where: { id: del.id } });
      }

      // Upsert nas seções que vieram
      for (const secao of data.secoes) {
        if (secao.id) {
          await db.secao.update({
            where: { id: secao.id },
            data: {
              tipo: secao.tipo,
              conteudo: secao.conteudo,
              titulo: secao.titulo || null,
              ordem: secao.ordem
            }
          });
        } else {
          await db.secao.create({
            data: {
              paginaId: data.id,
              tipo: secao.tipo,
              conteudo: secao.conteudo,
              titulo: secao.titulo || null,
              ordem: secao.ordem
            }
          });
        }
      }
    } else {
      // Criar
      await db.pagina.create({
        data: {
          titulo: data.titulo,
          slug,
          descricao: data.descricao || null,
          publicada: data.publicada,
          autorId: session.user.id,
          secoes: {
            create: data.secoes.map(s => ({
              tipo: s.tipo,
              conteudo: s.conteudo,
              titulo: s.titulo || null,
              ordem: s.ordem
            }))
          }
        }
      });
    }

    revalidatePath("/admin/paginas");
    revalidatePath("/");
    revalidatePath(`/paginas/${slug}`);
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "Já existe uma página com este título (slug)." };
    }
    return { success: false, error: "Erro ao salvar a página." };
  }
}

export async function deletePagina(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  try {
    await db.pagina.delete({
      where: { id }
    });
    
    revalidatePath("/admin/paginas");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao excluir página." };
  }
}
