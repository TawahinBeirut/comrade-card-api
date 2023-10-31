-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Score" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Statut" INTEGER NOT NULL DEFAULT 1,
    "Description" TEXT NOT NULL,
    "SellerId" INTEGER NOT NULL,
    "NbBaskets" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Basket" (
    "id" SERIAL NOT NULL,
    "ProdutsList" INTEGER[],

    CONSTRAINT "Basket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Command" (
    "id" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,
    "ProductsList" INTEGER[],

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id" SERIAL NOT NULL,
    "Score" INTEGER NOT NULL,
    "ProductsList" INTEGER[],
    "Stock" INTEGER NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_SellerId_key" ON "Product"("SellerId");

-- CreateIndex
CREATE UNIQUE INDEX "Command_UserId_key" ON "Command"("UserId");
