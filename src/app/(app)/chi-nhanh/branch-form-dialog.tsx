"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { branchSchema, type BranchInput } from "./schema"
import { createBranch, updateBranch } from "./actions"

type Branch = BranchInput & { id: string }

export function BranchFormDialog({ branch }: { branch?: Branch }) {
  const [open, setOpen] = useState(false)
  const isEdit = !!branch

  const form = useForm<BranchInput>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      code: branch?.code ?? "",
      name: branch?.name ?? "",
      address: branch?.address ?? "",
      isActive: branch?.isActive ?? true,
    },
  })

  async function onSubmit(values: BranchInput) {
    try {
      if (isEdit) {
        await updateBranch(branch.id, values)
        toast.success("Đã cập nhật chi nhánh")
      } else {
        await createBranch(values)
        toast.success("Đã tạo chi nhánh mới")
        form.reset({ code: "", name: "", address: "", isActive: true })
      }
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          form.reset({
            code: branch?.code ?? "",
            name: branch?.name ?? "",
            address: branch?.address ?? "",
            isActive: branch?.isActive ?? true,
          })
        }
      }}
    >
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm chi nhánh
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa chi nhánh" : "Thêm chi nhánh"}</DialogTitle>
          <DialogDescription>
            Thông tin chi nhánh / nhà hàng trong hệ thống.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã chi nhánh</FormLabel>
                  <FormControl>
                    <Input placeholder="CN01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chi nhánh</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhà hàng Quận 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Địa chỉ chi nhánh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border border-border p-3">
                  <FormLabel className="mb-0">Đang hoạt động</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEdit ? "Lưu thay đổi" : "Tạo chi nhánh"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
