-- CreateEnum
CREATE TYPE "public"."UserPermission" AS ENUM ('BLOCK_PERSONS', 'ALL', 'APPROVE_PERSON', 'EDIT_STATIC_PAGES', 'MANAGE_BANNERS');

-- CreateEnum
CREATE TYPE "public"."BannerPosition" AS ENUM ('LEFT', 'RIGHT');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "permissions" "public"."UserPermission"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pet" (
    "id" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "serialNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "blockedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "price" TEXT,
    "groupLink" TEXT,
    "contactLink" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaticPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaticPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Banner" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "position" "public"."BannerPosition" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nick_key" ON "public"."User"("nick");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_nick_key" ON "public"."Pet"("nick");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_serialNumber_key" ON "public"."Pet"("serialNumber");

-- CreateIndex
CREATE INDEX "Pet_approvedAt_blockedAt_createdAt_idx" ON "public"."Pet"("approvedAt", "blockedAt", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Pet_approvedAt_blockedAt_serialNumber_idx" ON "public"."Pet"("approvedAt", "blockedAt", "serialNumber" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "StaticPage_slug_key" ON "public"."StaticPage"("slug");

-- AddForeignKey
ALTER TABLE "public"."Pet" ADD CONSTRAINT "Pet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
