import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ success: false, message: "Usuário não encontrado" }, { status: 404 });
    }

    const data = await req.json();

    // Buscar categoria (vamos usar a primeira que existir ou a padrão)
    let categoria = await prisma.categoria.findFirst();
    if (!categoria) {
      categoria = await prisma.categoria.create({ data: { nome: 'Geral', slug: 'geral' } });
    }

    const post = await prisma.post.create({
      data: {
        titulo: data.titulo,
        slug: data.slug,
        resumo: data.resumo,
        imagem: data.imagem,
        conteudo: data.conteudo,
        publicado: data.publicado,
        dataPublicacao: data.publicado ? new Date() : null,
        autorId: user.id,
        categoriaId: data.categoriaId || categoria.id
      }
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error("Erro POST Noticia:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 });
    }

    const data = await req.json();
    const { id, ...updateData } = data;

    if (updateData.publicado) {
      updateData.dataPublicacao = new Date();
    }

    const post = await prisma.post.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error("Erro PUT Noticia:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID não fornecido" }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro DELETE Noticia:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
