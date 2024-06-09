-- CreateTable
CREATE TABLE "Item" (
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

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" TEXT NOT NULL DEFAULT '0',
    "itemId" TEXT NOT NULL,
    CONSTRAINT "File_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT,
    "faviconPath" TEXT,
    "previewImagePath" TEXT,
    "screenshotPath" TEXT,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "Bookmark_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookmarkHighlight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "position" INTEGER NOT NULL DEFAULT 0,
    "text" TEXT NOT NULL,
    "rangeJSON" TEXT NOT NULL,
    "bookmarkId" TEXT NOT NULL,
    CONSTRAINT "BookmarkHighlight_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "Bookmark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Audio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "duration" REAL,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "Audio_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "text" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "preview" TEXT NOT NULL,
    "words" INTEGER NOT NULL DEFAULT 0,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "text_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "duration" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "aspectRatio" TEXT,
    "metaBitrate" TEXT,
    "bitrate" TEXT,
    "fps" REAL,
    "itemId" TEXT NOT NULL,
    "thumbTime" REAL,
    "thumbImageName" TEXT,
    CONSTRAINT "Video_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VideoMark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mark" REAL NOT NULL,
    "videoId" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "VideoMark_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ItemToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ItemToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ItemToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TagToVideoMark" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TagToVideoMark_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TagToVideoMark_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoMark" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "File_itemId_key" ON "File"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_itemId_key" ON "Bookmark"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Audio_itemId_key" ON "Audio"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "text_itemId_key" ON "text"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_itemId_key" ON "Video"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToTag_AB_unique" ON "_ItemToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToTag_B_index" ON "_ItemToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TagToVideoMark_AB_unique" ON "_TagToVideoMark"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToVideoMark_B_index" ON "_TagToVideoMark"("B");
