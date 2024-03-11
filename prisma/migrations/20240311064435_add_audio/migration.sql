-- AlterTable
ALTER TABLE "Video" ADD COLUMN "thumbTime" REAL;

-- CreateTable
CREATE TABLE "Audio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "duration" INTEGER,
    "itemId" TEXT NOT NULL,
    "thumbTime" REAL,
    CONSTRAINT "Audio_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VideoMark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mark" REAL NOT NULL,
    "videoId" TEXT,
    "note" TEXT,
    "tagId" TEXT,
    "audioId" TEXT,
    CONSTRAINT "VideoMark_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VideoMark_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VideoMark_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VideoMark_audioId_fkey" FOREIGN KEY ("audioId") REFERENCES "Audio" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VideoMark_audioId_fkey" FOREIGN KEY ("audioId") REFERENCES "Audio" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Audio_itemId_key" ON "Audio"("itemId");
