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
import { ingredientSchema, type IngredientInput } from "./schema"
import { createIngredient, updateIngredient } from "./actions"

type Ingredient = IngredientInput & { id: string }
type CategoryOption = { id: string; name: string }

export function IngredientFormDialog({
  ingredient,
  categories,
}: {
  ingredient?: Ingredient
  categories: CategoryOption[]
}) {
  const [open, setOpen] = useState(false)
  const isEdit = !!ingredient

  const defaultValues: IngredientInput = {
    name: ingredient?.name ?? "",
    categoryId: ingredient?.categoryId ?? categories[0]?.id ?? "",
    unit: ingredient?.unit ?? "",
    unitPrice: ingredient?.unitPrice ?? 0,
    minStock: ingredient?.minStock ?? 0,
    isActive: ingredient?.isActive ?? true,
  }

  const form = useForm<IngredientInput>({
    resolver: zodResolver(ingredientSchema) as Resolver<IngredientInput>,
    defaultValues,
  })

  async function onSubmit(values: IngredientInput) {
    try {
      if (isEdit) {
        await updateIngredient(ingredient.id, values)
        toast.success("Đã cập nhật nguyên liệu")
      } else {
        await createIngredient(values)
        toast.success("Đã tạo nguyên liệu mới")
        form.reset({ ...defaultValues, name: "", unit: "", unitPrice: 0, minStock: 0 })
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
            Thêm nguyên liệu
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa nguyên liệu" : "Thêm nguyên liệu"}</DialogTitle>
          <DialogDescription>
            {noCategory
              ? "Cần tạo danh mục nguyên liệu trước khi thêm."
              : "Thông tin nguyên liệu dùng trong kho & công thức."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên nguyên liệu</FormLabel>
                  <FormControl>
                    <Input placeholder="Thịt bò, Hành lá..." {...field} />
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn vị tính</FormLabel>
                    <FormControl>
                      <Input placeholder="kg, lít, cái..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tồn tối thiểu</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đơn giá (VNĐ)</FormLabel>
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
                  <FormLabel className="mb-0">Đang sử dụng</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEdit ? "Lưu thay đổi" : "Tạo nguyên liệu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
