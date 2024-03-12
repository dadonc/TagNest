-- CreateTable
CREATE TABLE "text" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "preview" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "text_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "text_itemId_key" ON "text"("itemId");
