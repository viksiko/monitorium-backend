-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'REPRESENTATIVE', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "district" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "isRepresentative" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "position" TEXT,
    "party" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "tasksTotal" INTEGER NOT NULL DEFAULT 0,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "attendance" DOUBLE PRECISION DEFAULT 0.0,
    "lastActivity" TIMESTAMP(3),
    "gosuslugiId" TEXT,
    "sberId" TEXT,
    "tinkoffId" TEXT,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_gosuslugiId_key" ON "users"("gosuslugiId");

-- CreateIndex
CREATE UNIQUE INDEX "users_sberId_key" ON "users"("sberId");

-- CreateIndex
CREATE UNIQUE INDEX "users_tinkoffId_key" ON "users"("tinkoffId");
