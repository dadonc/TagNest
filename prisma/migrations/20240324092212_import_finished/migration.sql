/*
  Warnings:

  - You are about to drop the column `getsCurrentlyImported` on the `Item` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "url" TEXT,
    "note" TEXT,
    "importFinished" BOOLEAN NOT NULL DEFAULT false,
    "importStep" INTEGER NOT NULL DEFAULT -1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "countOpened" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Item" ("countOpened", "createdAt", "id", "importStep", "name", "note", "type", "updatedAt", "url") SELECT "countOpened", "createdAt", "id", "importStep", "name", "note", "type", "updatedAt", "url" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
