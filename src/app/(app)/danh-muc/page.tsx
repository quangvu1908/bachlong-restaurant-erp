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
import { categoryKindLabel } from "./schema"
import { CategoryFormDialog } from "./category-form-dialog"
import { DeleteCategoryButton } from "./delete-category-button"

export default async function DanhMucPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ kind: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { ingredients: true, dishes: true } },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{categories.length} danh mục</p>
        <CategoryFormDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số mục liên kết</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-24 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Chưa có danh mục nào.
                  </TableCell>
                </TableRow>
              )}
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {categoryKindLabel[category.kind as "INGREDIENT" | "DISH"]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.kind === "INGREDIENT"
                      ? `${category._count.ingredients} nguyên liệu`
                      : `${category._count.dishes} món ăn`}
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Hoạt động" : "Ngừng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center justify-end gap-1">
                    <CategoryFormDialog
                      category={{
                        id: category.id,
                        name: category.name,
                        kind: category.kind as "INGREDIENT" | "DISH",
                        isActive: category.isActive,
                      }}
                    />
                    <DeleteCategoryButton id={category.id} name={category.name} />
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
