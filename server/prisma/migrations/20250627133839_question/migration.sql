-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "question" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "slug" TEXT DEFAULT 'send me anonympus messages!';
