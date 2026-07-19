import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 });
    }

    const galerias = await prisma.galeria.findMany({
      include: {
        criador: true,
        _count: {
          select: { imagens: true }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: galerias });
  } catch (error: any) {
    console.error("Erro GET Galerias:", error);
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

    const galeria = await prisma.galeria.create({
      data: {
        titulo: data.titulo,
        slug: data.slug,
        descricao: data.descricao,
        publicada: data.publicada,
        criadorId: user.id,
        imagens: {
          create: data.imagens.map((img: any, index: number) => ({
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
    console.error("Erro POST Galeria:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
