import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getUploadDirectory() {
  const configuredDir = process.env.UPLOAD_DIR || process.env.UPLOADS_DIR;
  if (configuredDir) {
    return configuredDir;
  }

  return path.join(process.cwd(), 'public', 'uploads');
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const fallbackFile = formData.get('file') as File | null;
    const uploadFile = file ?? fallbackFile;

    if (!uploadFile || typeof uploadFile === 'string') {
      return NextResponse.json({ error: 'Nenhum arquivo recebido.' }, { status: 400 });
    }

    const buffer = Buffer.from(await uploadFile.arrayBuffer());
    const originalName = uploadFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${originalName}`;
    const uploadDir = getUploadDirectory();

    fs.mkdirSync(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      data: {
        link: publicUrl
      }
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Erro interno ao processar upload.'
    }, { status: 500 });
  }
}
