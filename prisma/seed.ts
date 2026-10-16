import { PrismaClient, type Branch, type Ingredient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const branchData = [
    { code: "CN01", name: "Nhà hàng Quận 1", address: "12 Lê Lợi, Quận 1, TP.HCM" },
    { code: "CN02", name: "Nhà hàng Quận 7", address: "88 Nguyễn Thị Thập, Quận 7, TP.HCM" },
    { code: "CN03", name: "Nhà hàng Thủ Đức", address: "5 Võ Văn Ngân, Thủ Đức, TP.HCM" },
  ]
  const branches: Branch[] = []
  for (const b of branchData) {
    branches.push(
      await prisma.branch.upsert({ where: { code: b.code }, create: b, update: b })
    )
  }

  const rawMaterials = await prisma.category.upsert({
    where: { name_kind: { name: "Nguyên liệu tươi", kind: "INGREDIENT" } },
    create: { name: "Nguyên liệu tươi", kind: "INGREDIENT" },
    update: {},
  })
  const dryGoods = await prisma.category.upsert({
    where: { name_kind: { name: "Gia vị & khô", kind: "INGREDIENT" } },
    create: { name: "Gia vị & khô", kind: "INGREDIENT" },
    update: {},
  })
  const mainDishes = await prisma.category.upsert({
    where: { name_kind: { name: "Món chính", kind: "DISH" } },
    create: { name: "Món chính", kind: "DISH" },
    update: {},
  })
  const appetizers = await prisma.category.upsert({
    where: { name_kind: { name: "Khai vị", kind: "DISH" } },
    create: { name: "Khai vị", kind: "DISH" },
    update: {},
  })

  const ingredientData = [
    { name: "Thịt bò", unit: "kg", unitPrice: 280000, minStock: 10, categoryId: rawMaterials.id },
    { name: "Thịt heo", unit: "kg", unitPrice: 150000, minStock: 10, categoryId: rawMaterials.id },
    { name: "Hành lá", unit: "kg", unitPrice: 25000, minStock: 3, categoryId: rawMaterials.id },
    { name: "Nước mắm", unit: "lít", unitPrice: 60000, minStock: 5, categoryId: dryGoods.id },
    { name: "Tiêu xay", unit: "kg", unitPrice: 180000, minStock: 1, categoryId: dryGoods.id },
    { name: "Bánh phở", unit: "kg", unitPrice: 20000, minStock: 15, categoryId: dryGoods.id },
  ]
  const ingredients: Ingredient[] = []
  for (const i of ingredientData) {
    const existing = await prisma.ingredient.findFirst({ where: { name: i.name } })
    ingredients.push(
      existing ?? (await prisma.ingredient.create({ data: i }))
    )
  }

  const dishData = [
    { name: "Phở bò", price: 65000, categoryId: mainDishes.id },
    { name: "Bún thịt nướng", price: 55000, categoryId: mainDishes.id },
    { name: "Gỏi cuốn", price: 35000, categoryId: appetizers.id },
    { name: "Chả giò", price: 40000, categoryId: appetizers.id },
  ]
  for (const d of dishData) {
    const existing = await prisma.dish.findFirst({ where: { name: d.name } })
    if (!existing) await prisma.dish.create({ data: d })
  }

  for (const branch of branches) {
    for (const ingredient of ingredients) {
      const existing = await prisma.stockLevel.findUnique({
        where: { branchId_ingredientId: { branchId: branch.id, ingredientId: ingredient.id } },
      })
      if (existing) continue
      const quantity = Math.round(Math.random() * 40) + 5
      await prisma.stockLevel.create({
        data: { branchId: branch.id, ingredientId: ingredient.id, quantity },
      })
      await prisma.stockMovement.create({
        data: {
          branchId: branch.id,
          ingredientId: ingredient.id,
          type: "IN",
          quantity,
          note: "Nhập kho ban đầu (seed)",
        },
      })
    }
  }

  console.log("Seed hoàn tất.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
