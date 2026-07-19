import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: Request) {
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

    const galeria = await prisma.galeria.findUnique({
      where: { id },
      include: {
        imagens: {
          orderBy: { ordem: 'asc' }
        }
      }
    });

    if (!galeria) {
      return NextResponse.json({ success: false, message: "Galeria não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: galeria });
  } catch (error: any) {
    console.error("Erro GET Galeria:", error);
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
    const { id, imagens, ...updateData } = data;

    // Atualiza dados da galeria e substitui as imagens 
    // (deleta todas e recria para manter ordem fácil e não ter que fazer sync complicado)
    
    // Primeiro deleta todas imagens antigas
    await prisma.imagem.deleteMany({
      where: { galeriaId: id }
    });

    // Então atualiza a galeria recriando as imagens
    const galeria = await prisma.galeria.update({
      where: { id },
      data: {
        ...updateData,
        imagens: {
          create: imagens.map((img: any, index: number) => ({
            url: img.url,
            titulo: img.titulo || "Imagem",
            descricao: img.descricao || "",
            altText: img.altText || "",
            ordem: index
          }))
        }
      },
      include: {
        imagens: true
      }
    });

    return NextResponse.json({ success: true, data: galeria });
  } catch (error: any) {
    console.error("Erro PUT Galeria:", error);
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

    await prisma.galeria.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro DELETE Galeria:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
