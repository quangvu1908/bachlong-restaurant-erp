import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatNumber } from "@/lib/format"
import { IngredientFormDialog } from "./ingredient-form-dialog"
import { DeleteIngredientButton } from "./delete-ingredient-button"

export default async function NguyenLieuPage() {
  const [ingredients, categories] = await Promise.all([
    prisma.ingredient.findMany({
      orderBy: { createdAt: "asc" },
      include: { category: true },
    }),
    prisma.category.findMany({
      where: { kind: "INGREDIENT", isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{ingredients.length} nguyên liệu</p>
        <IngredientFormDialog categories={categories} />
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Chưa có danh mục nguyên liệu. Vào mục &quot;Danh mục&quot; để tạo trước.
        </p>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên nguyên liệu</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Tồn tối thiểu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-24 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Chưa có nguyên liệu nào.
                  </TableCell>
                </TableRow>
              )}
              {ingredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell className="font-medium">{ingredient.name}</TableCell>
                  <TableCell className="text-muted-foreground">{ingredient.category.name}</TableCell>
                  <TableCell>{ingredient.unit}</TableCell>
                  <TableCell>{formatCurrency(ingredient.unitPrice)}</TableCell>
                  <TableCell>{formatNumber(ingredient.minStock)}</TableCell>
                  <TableCell>
                    <Badge variant={ingredient.isActive ? "default" : "secondary"}>
                      {ingredient.isActive ? "Hoạt động" : "Ngừng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center justify-end gap-1">
                    <IngredientFormDialog
                      categories={categories}
                      ingredient={{
                        id: ingredient.id,
                        name: ingredient.name,
                        categoryId: ingredient.categoryId,
                        unit: ingredient.unit,
                        unitPrice: ingredient.unitPrice,
                        minStock: ingredient.minStock,
                        isActive: ingredient.isActive,
                      }}
                    />
                    <DeleteIngredientButton id={ingredient.id} name={ingredient.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
