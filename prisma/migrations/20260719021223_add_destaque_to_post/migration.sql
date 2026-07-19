-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "imagem" TEXT,
    "autorId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "galeriaId" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "dataPublicacao" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "visualizacoes" INTEGER NOT NULL DEFAULT 0,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Post_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_galeriaId_fkey" FOREIGN KEY ("galeriaId") REFERENCES "Galeria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("atualizadoEm", "autorId", "categoriaId", "conteudo", "criadoEm", "dataPublicacao", "galeriaId", "id", "imagem", "publicado", "resumo", "slug", "titulo", "visualizacoes") SELECT "atualizadoEm", "autorId", "categoriaId", "conteudo", "criadoEm", "dataPublicacao", "galeriaId", "id", "imagem", "publicado", "resumo", "slug", "titulo", "visualizacoes" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
CREATE INDEX "Post_slug_idx" ON "Post"("slug");
CREATE INDEX "Post_publicado_idx" ON "Post"("publicado");
CREATE INDEX "Post_autorId_idx" ON "Post"("autorId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
