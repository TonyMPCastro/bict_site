-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Engenharia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT,
    "coordenador" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "grade" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    "publicada" BOOLEAN NOT NULL DEFAULT true,
    "landingPageConfig" TEXT,
    "landingPageEnabled" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Engenharia" ("atualizadoEm", "coordenador", "criadoEm", "descricao", "email", "grade", "id", "imagem", "nome", "publicada", "slug", "telefone") SELECT "atualizadoEm", "coordenador", "criadoEm", "descricao", "email", "grade", "id", "imagem", "nome", "publicada", "slug", "telefone" FROM "Engenharia";
DROP TABLE "Engenharia";
ALTER TABLE "new_Engenharia" RENAME TO "Engenharia";
CREATE UNIQUE INDEX "Engenharia_nome_key" ON "Engenharia"("nome");
CREATE UNIQUE INDEX "Engenharia_slug_key" ON "Engenharia"("slug");
CREATE INDEX "Engenharia_slug_idx" ON "Engenharia"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
