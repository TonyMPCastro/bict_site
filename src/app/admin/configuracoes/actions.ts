"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getConfiguracoes() {
  const configs = await db.configuracao.findMany();
  // Transforma array [{chave: "x", valor: "y"}] em um objeto {x: "y"}
  return configs.reduce((acc, curr) => {
    acc[curr.chave] = curr.valor;
    return acc;
  }, {} as Record<string, string>);
}

export async function saveConfiguracoes(data: Record<string, string>) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  try {
    // Para cada chave do formulário, fazemos um upsert no banco
    for (const [chave, valor] of Object.entries(data)) {
      await db.configuracao.upsert({
        where: { chave },
        update: { valor },
        create: { chave, valor }
      });
    }

    revalidatePath("/", "layout"); // Revalida o site todo
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao salvar configurações." };
  }
}
