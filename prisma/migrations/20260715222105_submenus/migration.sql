-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icone" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "menuId" TEXT NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "MenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MenuItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MenuItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MenuItem" ("icone", "id", "label", "menuId", "ordem", "url") SELECT "icone", "id", "label", "menuId", "ordem", "url" FROM "MenuItem";
DROP TABLE "MenuItem";
ALTER TABLE "new_MenuItem" RENAME TO "MenuItem";
CREATE INDEX "MenuItem_menuId_idx" ON "MenuItem"("menuId");
CREATE INDEX "MenuItem_parentId_idx" ON "MenuItem"("parentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
