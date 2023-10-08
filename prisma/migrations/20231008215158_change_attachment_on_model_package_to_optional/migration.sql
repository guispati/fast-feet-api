-- DropForeignKey
ALTER TABLE "packages" DROP CONSTRAINT "packages_attachment_id_fkey";

-- AlterTable
ALTER TABLE "packages" ALTER COLUMN "attachment_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
