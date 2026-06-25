-- CreateTable
CREATE TABLE "maintenance_tickets" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "room_number" VARCHAR(10) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "severity" VARCHAR(15) NOT NULL DEFAULT 'Medium',
    "status" VARCHAR(20) NOT NULL DEFAULT 'Open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_tickets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "maintenance_tickets" ADD CONSTRAINT "maintenance_tickets_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
