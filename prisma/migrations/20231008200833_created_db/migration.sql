-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DELIVERER');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('CREATED', 'WAITING', 'WITHDRAWN', 'DELIVERED', 'RETURNED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'DELIVERER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "StatusType" NOT NULL DEFAULT 'CREATED',
    "recipient_id" TEXT NOT NULL,
    "posted_at" TIMESTAMP(3) NOT NULL,
    "picked_up_at" TIMESTAMP(3),
    "deliverer_id" TEXT,
    "delivered_at" TIMESTAMP(3),
    "attachment_id" TEXT NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,

    CONSTRAINT "recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_deliverer_id_fkey" FOREIGN KEY ("deliverer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
