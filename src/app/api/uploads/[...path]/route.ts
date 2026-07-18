import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getUploadDirectory() {
  const configuredDir = process.env.UPLOAD_DIR || process.env.UPLOADS_DIR;
  if (configuredDir) return configuredDir;
  return path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads');
}

const MIME_TYPES: Record<string, string> = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.pdf':  'application/pdf',
  '.mp4':  'video/mp4',
  '.mp3':  'audio/mpeg',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  const uploadDir = getUploadDirectory();
  // Previne path traversal
  const filePath = path.resolve(uploadDir, ...segments);
  if (!filePath.startsWith(path.resolve(uploadDir))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';
  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
