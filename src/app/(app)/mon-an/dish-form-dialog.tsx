"use client"

import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { dishSchema, type DishInput } from "./schema"
import { createDish, updateDish } from "./actions"

type Dish = DishInput & { id: string }
type CategoryOption = { id: string; name: string }

export function DishFormDialog({
  dish,
  categories,
}: {
  dish?: Dish
  categories: CategoryOption[]
}) {
  const [open, setOpen] = useState(false)
  const isEdit = !!dish

  const defaultValues: DishInput = {
    name: dish?.name ?? "",
    categoryId: dish?.categoryId ?? categories[0]?.id ?? "",
    price: dish?.price ?? 0,
    isActive: dish?.isActive ?? true,
  }

  const form = useForm<DishInput>({
    resolver: zodResolver(dishSchema) as Resolver<DishInput>,
    defaultValues,
  })

  async function onSubmit(values: DishInput) {
    try {
      if (isEdit) {
        await updateDish(dish.id, values)
        toast.success("Đã cập nhật món ăn")
      } else {
        await createDish(values)
        toast.success("Đã tạo món ăn mới")
        form.reset({ ...defaultValues, name: "", price: 0 })
      }
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
    }
  }

  const noCategory = categories.length === 0

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) form.reset(defaultValues)
      }}
    >
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={noCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm món ăn
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa món ăn" : "Thêm món ăn"}</DialogTitle>
          <DialogDescription>
            {noCategory
              ? "Cần tạo danh mục món ăn trước khi thêm."
              : "Thông tin món ăn trong thực đơn."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên món ăn</FormLabel>
                  <FormControl>
                    <Input placeholder="Phở bò, Gỏi cuốn..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá bán (VNĐ)</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
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
                  <FormLabel className="mb-0">Đang bán</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEdit ? "Lưu thay đổi" : "Tạo món ăn"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
