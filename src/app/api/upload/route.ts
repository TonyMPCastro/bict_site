import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null; // O plugin do Draft.js envia o arquivo como 'image'

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo recebido.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${originalName}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;

    // O react-draft-wysiwyg espera este formato exato: { data: { link: "url..." } }
    return NextResponse.json({
      data: {
        link: publicUrl
      }
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json({ error: 'Erro interno ao processar upload.' }, { status: 500 });
  }
}
