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
import { formatCurrency } from "@/lib/format"
import { DishFormDialog } from "./dish-form-dialog"
import { DeleteDishButton } from "./delete-dish-button"

export default async function MonAnPage() {
  const [dishes, categories] = await Promise.all([
    prisma.dish.findMany({
      orderBy: { createdAt: "asc" },
      include: { category: true },
    }),
    prisma.category.findMany({
      where: { kind: "DISH", isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{dishes.length} món ăn</p>
        <DishFormDialog categories={categories} />
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Chưa có danh mục món ăn. Vào mục &quot;Danh mục&quot; để tạo trước.
        </p>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên món ăn</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá bán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-24 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dishes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Chưa có món ăn nào.
                  </TableCell>
                </TableRow>
              )}
              {dishes.map((dish) => (
                <TableRow key={dish.id}>
                  <TableCell className="font-medium">{dish.name}</TableCell>
                  <TableCell className="text-muted-foreground">{dish.category.name}</TableCell>
                  <TableCell>{formatCurrency(dish.price)}</TableCell>
                  <TableCell>
                    <Badge variant={dish.isActive ? "default" : "secondary"}>
                      {dish.isActive ? "Đang bán" : "Ngừng bán"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center justify-end gap-1">
                    <DishFormDialog
                      categories={categories}
                      dish={{
                        id: dish.id,
                        name: dish.name,
                        categoryId: dish.categoryId,
                        price: dish.price,
                        isActive: dish.isActive,
                      }}
                    />
                    <DeleteDishButton id={dish.id} name={dish.name} />
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
