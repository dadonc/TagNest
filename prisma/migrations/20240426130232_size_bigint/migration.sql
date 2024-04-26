/*
  Warnings:

  - You are about to alter the column `size` on the `File` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" BIGINT NOT NULL DEFAULT 0,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "File_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_File" ("created", "id", "itemId", "path", "size", "updated") SELECT "created", "id", "itemId", "path", "size", "updated" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE UNIQUE INDEX "File_itemId_key" ON "File"("itemId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
