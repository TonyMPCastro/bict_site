import fs from 'fs';
import path from 'path';

export function getUploadDirectory() {
  const configuredDir = process.env.UPLOAD_DIR || process.env.UPLOADS_DIR;
  if (configuredDir) {
    return configuredDir;
  }
  return path.join(process.cwd(), 'public', 'uploads');
}

export function extractAndRemoveImages(content: string) {
  if (!content) return;

  // Regex para encontrar URLs do tipo /api/uploads/nome-do-arquivo
  const regex = /\/api\/uploads\/([a-zA-Z0-9_.-]+)/g;
  
  let match;
  const filesToDelete = new Set<string>();

  while ((match = regex.exec(content)) !== null) {
    // O grupo 1 contém apenas o nome do arquivo
    filesToDelete.add(match[1]);
  }

  if (filesToDelete.size === 0) return;

  const uploadDir = getUploadDirectory();

  filesToDelete.forEach((filename) => {
    try {
      const filepath = path.join(uploadDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log(`[Upload Utils] Arquivo apagado do servidor: ${filename}`);
      }
    } catch (error) {
      console.error(`[Upload Utils] Erro ao apagar arquivo ${filename}:`, error);
    }
  });
}
