/*
  Warnings:

  - Added the required column `size` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "url" TEXT,
    "note" TEXT,
    "getsCurrentlyImported" BOOLEAN NOT NULL DEFAULT false,
    "importStep" INTEGER NOT NULL DEFAULT -1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "countOpened" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Item" ("createdAt", "getsCurrentlyImported", "id", "importStep", "name", "note", "type", "updatedAt", "url") SELECT "createdAt", "getsCurrentlyImported", "id", "importStep", "name", "note", "type", "updatedAt", "url" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "File_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_File" ("createdAt", "id", "itemId", "path") SELECT "createdAt", "id", "itemId", "path" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_itemId_key" ON "File"("itemId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
