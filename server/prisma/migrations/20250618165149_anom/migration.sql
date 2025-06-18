-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "revealPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "senderId" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
