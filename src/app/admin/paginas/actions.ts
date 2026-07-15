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
  descricao?: string;
  conteudo: string;
  publicada: boolean;
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

      // Atualizar ou criar a seção principal de conteúdo
      const secoes = await db.secao.findMany({ where: { paginaId: data.id } });
      if (secoes.length > 0) {
        await db.secao.update({
          where: { id: secoes[0].id },
          data: { conteudo: data.conteudo }
        });
      } else {
        await db.secao.create({
          data: {
            paginaId: data.id,
            tipo: "TEXTO",
            conteudo: data.conteudo,
            ordem: 0
          }
        });
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
            create: {
              tipo: "TEXTO",
              conteudo: data.conteudo,
              ordem: 0
            }
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
