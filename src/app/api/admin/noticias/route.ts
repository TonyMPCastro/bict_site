import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractAndRemoveImages } from "@/lib/upload-utils";
import { db as prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined;
    
    const posts = await prisma.post.findMany({
      where: { publicado: true },
      orderBy: { dataPublicacao: 'desc' },
      take: limit,
      include: { autor: { select: { nome: true } }, categoria: true }
    });
    
    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

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

    if (data.destaque) {
      await prisma.post.updateMany({
        data: { destaque: false }
      });
    }

    const post = await prisma.post.create({
      data: {
        titulo: data.titulo,
        slug: data.slug,
        resumo: data.resumo,
        imagem: data.imagem,
        conteudo: data.conteudo,
        publicado: data.publicado,
        destaque: data.destaque || false,
        landingPageConfig: data.landingPageConfig || null,
        dataPublicacao: data.publicado ? new Date() : null,
        autorId: user.id,
        categoriaId: data.categoriaId || categoria.id,
        galeriaId: data.galeriaId || null
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

    if (updateData.galeriaId === "") {
      updateData.galeriaId = null;
    }
    
    if (updateData.categoriaId === "") {
      updateData.categoriaId = null;
    }

    if (updateData.destaque) {
      await prisma.post.updateMany({
        where: { id: { not: id } },
        data: { destaque: false }
      });
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

    const post = await prisma.post.findUnique({
      where: { id },
      select: { imagem: true, conteudo: true }
    });

    if (post) {
      const allContent = `${post.imagem || ''} ${post.conteudo || ''}`;
      extractAndRemoveImages(allContent);
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
