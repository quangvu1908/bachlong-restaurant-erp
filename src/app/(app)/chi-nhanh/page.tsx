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
import { BranchFormDialog } from "./branch-form-dialog"
import { DeleteBranchButton } from "./delete-branch-button"

export default async function ChiNhanhPage() {
  const branches = await prisma.branch.findMany({ orderBy: { createdAt: "asc" } })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {branches.length} chi nhánh
        </p>
        <BranchFormDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Tên chi nhánh</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-24 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Chưa có chi nhánh nào. Bấm &quot;Thêm chi nhánh&quot; để tạo mới.
                  </TableCell>
                </TableRow>
              )}
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-mono">{branch.code}</TableCell>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell className="text-muted-foreground">{branch.address || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={branch.isActive ? "default" : "secondary"}>
                      {branch.isActive ? "Hoạt động" : "Ngừng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center justify-end gap-1">
                    <BranchFormDialog
                      branch={{
                        id: branch.id,
                        code: branch.code,
                        name: branch.name,
                        address: branch.address ?? "",
                        isActive: branch.isActive,
                      }}
                    />
                    <DeleteBranchButton id={branch.id} name={branch.name} />
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
