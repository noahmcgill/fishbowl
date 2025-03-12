-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "gridState" JSONB NOT NULL DEFAULT '{ "widgets": [], "layouts": { "lg": [], "md": [] } }';
