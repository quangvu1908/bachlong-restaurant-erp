import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { formatDateTime, formatNumber } from "@/lib/format"
import { movementTypeLabel } from "./schema"
import { StockMovementFormDialog } from "./stock-movement-form-dialog"

export default async function NhapXuatKhoPage() {
  const [branches, ingredients, movements, stockLevels] = await Promise.all([
    prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.ingredient.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, unit: true },
    }),
    prisma.stockMovement.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { branch: true, ingredient: true },
    }),
    prisma.stockLevel.findMany({
      orderBy: [{ branch: { name: "asc" } }, { ingredient: { name: "asc" } }],
      include: { branch: true, ingredient: true },
    }),
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {movements.length} phiếu gần nhất
        </p>
        <StockMovementFormDialog branches={branches} ingredients={ingredients} />
      </div>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Lịch sử giao dịch</TabsTrigger>
          <TabsTrigger value="stock">Tồn kho hiện tại</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Chi nhánh</TableHead>
                    <TableHead>Nguyên liệu</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Ghi chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                        Chưa có phiếu nhập/xuất nào.
                      </TableCell>
                    </TableRow>
                  )}
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(movement.createdAt)}
                      </TableCell>
                      <TableCell>{movement.branch.name}</TableCell>
                      <TableCell>{movement.ingredient.name}</TableCell>
                      <TableCell>
                        <Badge variant={movement.type === "IN" ? "default" : "secondary"}>
                          {movementTypeLabel[movement.type as "IN" | "OUT"]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatNumber(movement.quantity)} {movement.ingredient.unit}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {movement.note || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chi nhánh</TableHead>
                    <TableHead>Nguyên liệu</TableHead>
                    <TableHead>Tồn hiện tại</TableHead>
                    <TableHead>Tồn tối thiểu</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockLevels.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                        Chưa có dữ liệu tồn kho.
                      </TableCell>
                    </TableRow>
                  )}
                  {stockLevels.map((level) => {
                    const low = level.quantity < level.ingredient.minStock
                    return (
                      <TableRow key={level.id}>
                        <TableCell>{level.branch.name}</TableCell>
                        <TableCell>{level.ingredient.name}</TableCell>
                        <TableCell className={low ? "font-medium text-destructive" : ""}>
                          {formatNumber(level.quantity)} {level.ingredient.unit}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatNumber(level.ingredient.minStock)} {level.ingredient.unit}
                        </TableCell>
                        <TableCell>
                          {low ? (
                            <Badge variant="destructive">Sắp hết</Badge>
                          ) : (
                            <Badge variant="outline">Ổn định</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
