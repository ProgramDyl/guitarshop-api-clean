-- CreateTable
CREATE TABLE "guitars" (
    "product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "is_electric" BOOLEAN NOT NULL DEFAULT true,
    "scale" REAL NOT NULL DEFAULT 0.00,
    "cost" REAL NOT NULL DEFAULT 0.00,
    "image_filename" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "customer" (
    "customer_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Purchase" (
    "purchase_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "credit_card" BIGINT NOT NULL,
    "credit_expire" DATETIME NOT NULL,
    "credit_cvv" INTEGER NOT NULL,
    "invoice_amt" DECIMAL NOT NULL,
    "invoice_tax" DECIMAL NOT NULL,
    "invoice_total" DECIMAL NOT NULL,
    "order_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PurchaseItem" (
    "purchase_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("purchase_id", "product_id"),
    CONSTRAINT "PurchaseItem_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "Purchase" ("purchase_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PurchaseItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "guitars" ("product_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");
