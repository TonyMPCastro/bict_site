"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function saveMenuItem(data: {
  id?: string;
  label: string;
  url: string;
  ordem: number;
  parentId?: string | null;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  try {
    // Busca ou cria o menu "publico"
    let menuPublico = await db.menu.findUnique({ where: { nome: "publico" } });
    if (!menuPublico) {
      menuPublico = await db.menu.create({ data: { nome: "publico" } });
    }

    if (data.id) {
      await db.menuItem.update({
        where: { id: data.id },
        data: {
          label: data.label,
          url: data.url,
          ordem: data.ordem,
          parentId: data.parentId || null,
        }
      });
    } else {
      await db.menuItem.create({
        data: {
          label: data.label,
          url: data.url,
          ordem: data.ordem,
          parentId: data.parentId || null,
          menuId: menuPublico.id,
        }
      });
    }

    revalidatePath("/admin/menus");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao salvar item de menu." };
  }
}

export async function deleteMenuItem(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  try {
    await db.menuItem.delete({
      where: { id }
    });
    
    revalidatePath("/admin/menus");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao excluir item de menu." };
  }
}
