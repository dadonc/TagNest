/*
  Warnings:

  - You are about to drop the column `createdAt` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `File` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" INTEGER NOT NULL DEFAULT 0,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "File_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_File" ("id", "itemId", "path", "size") SELECT "id", "itemId", "path", "size" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_itemId_key" ON "File"("itemId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
