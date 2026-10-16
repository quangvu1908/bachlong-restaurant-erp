import Link from "next/link"
import { Building2, Package, TriangleAlert, UtensilsCrossed } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format"
import { movementTypeLabel } from "../nhap-xuat-kho/schema"
import { BranchValueChart } from "./branch-value-chart"

export default async function TongQuanPage() {
  const [branches, ingredientCount, dishCount, categoryCount, recentMovements] =
    await Promise.all([
      prisma.branch.findMany({
        include: { stockLevels: { include: { ingredient: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.ingredient.count(),
      prisma.dish.count(),
      prisma.category.count(),
      prisma.stockMovement.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { branch: true, ingredient: true },
      }),
    ])

  const branchStats = branches.map((branch) => {
    const totalValue = branch.stockLevels.reduce(
      (sum, level) => sum + level.quantity * level.ingredient.unitPrice,
      0
    )
    const lowStockCount = branch.stockLevels.filter(
      (level) => level.quantity < level.ingredient.minStock
    ).length
    return { id: branch.id, name: branch.name, isActive: branch.isActive, totalValue, lowStockCount }
  })

  const totalStockValue = branchStats.reduce((sum, b) => sum + b.totalValue, 0)
  const totalLowStock = branchStats.reduce((sum, b) => sum + b.lowStockCount, 0)

  const chartData = branchStats.map((b) => ({ name: b.name, value: b.totalValue }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={Building2}
          label="Chi nhánh"
          value={formatNumber(branches.length)}
          href="/chi-nhanh"
        />
        <SummaryCard
          icon={Package}
          label="Nguyên liệu"
          value={formatNumber(ingredientCount)}
          href="/nguyen-lieu"
        />
        <SummaryCard
          icon={UtensilsCrossed}
          label="Món ăn"
          value={formatNumber(dishCount)}
          href="/mon-an"
        />
        <SummaryCard
          icon={TriangleAlert}
          label="Nguyên liệu sắp hết (toàn hệ thống)"
          value={formatNumber(totalLowStock)}
          href="/nhap-xuat-kho"
          warn={totalLowStock > 0}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Giá trị tồn kho theo chi nhánh</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Chưa có dữ liệu. Tạo chi nhánh và ghi nhận nhập kho để xem biểu đồ.
              </p>
            ) : (
              <BranchValueChart data={chartData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">So sánh nhanh theo chi nhánh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Tổng giá trị tồn kho: <span className="font-medium text-foreground">{formatCurrency(totalStockValue)}</span>
            </p>
            {branchStats.length === 0 && (
              <p className="text-sm text-muted-foreground">Chưa có chi nhánh nào.</p>
            )}
            {branchStats.map((branch) => (
              <div key={branch.id} className="flex items-center justify-between rounded-md border border-border p-2.5">
                <div>
                  <p className="text-sm font-medium">{branch.name}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(branch.totalValue)}</p>
                </div>
                {branch.lowStockCount > 0 ? (
                  <Badge variant="destructive">{branch.lowStockCount} sắp hết</Badge>
                ) : (
                  <Badge variant="outline">Ổn định</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Giao dịch gần đây</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Chi nhánh</TableHead>
                <TableHead>Nguyên liệu</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Số lượng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMovements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Chưa có giao dịch nào.
                  </TableCell>
                </TableRow>
              )}
              {recentMovements.map((movement) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Danh mục hiện có: {formatNumber(categoryCount)}. Quản lý tại{" "}
        <Link href="/danh-muc" className="underline">
          trang Danh mục
        </Link>
        .
      </p>
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  href,
  warn,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  href: string
  warn?: boolean
}) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:border-primary/50">
        <CardContent className="flex items-center gap-3 p-4">
          <div
            className={
              warn
                ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive"
                : "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground"
            }
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
