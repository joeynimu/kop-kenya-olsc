-- AlterTable
ALTER TABLE "User" ADD COLUMN     "shouldInviteToWhatsapp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shouldReceiveUpdates" BOOLEAN NOT NULL DEFAULT false;
