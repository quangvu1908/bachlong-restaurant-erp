"use client"

import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { movementTypeLabel, movementTypes, stockMovementSchema, type StockMovementInput } from "./schema"
import { createStockMovement } from "./actions"

type Option = { id: string; name: string; unit?: string }

const emptyValues: StockMovementInput = {
  branchId: "",
  ingredientId: "",
  type: "IN",
  quantity: 0,
  note: "",
}

export function StockMovementFormDialog({
  branches,
  ingredients,
}: {
  branches: Option[]
  ingredients: Option[]
}) {
  const [open, setOpen] = useState(false)

  const defaultValues: StockMovementInput = {
    ...emptyValues,
    branchId: branches[0]?.id ?? "",
    ingredientId: ingredients[0]?.id ?? "",
  }

  const form = useForm<StockMovementInput>({
    resolver: zodResolver(stockMovementSchema) as Resolver<StockMovementInput>,
    defaultValues,
  })

  const disabled = branches.length === 0 || ingredients.length === 0

  async function onSubmit(values: StockMovementInput) {
    try {
      await createStockMovement(values)
      toast.success(values.type === "IN" ? "Đã ghi nhận nhập kho" : "Đã ghi nhận xuất kho")
      form.reset(defaultValues)
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
    }
  }

  const selectedIngredient = ingredients.find((i) => i.id === form.watch("ingredientId"))

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) form.reset(defaultValues)
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo phiếu kho
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo phiếu nhập / xuất kho</DialogTitle>
          <DialogDescription>
            {disabled
              ? "Cần có chi nhánh và nguyên liệu trước khi tạo phiếu."
              : "Ghi nhận thay đổi tồn kho nguyên liệu theo chi nhánh."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại phiếu</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {movementTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {movementTypeLabel[type]}
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
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chi nhánh</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn chi nhánh" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
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
              name="ingredientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nguyên liệu</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn nguyên liệu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ingredients.map((ingredient) => (
                        <SelectItem key={ingredient.id} value={ingredient.id}>
                          {ingredient.name}
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
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Số lượng {selectedIngredient?.unit ? `(${selectedIngredient.unit})` : ""}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ghi chú (không bắt buộc)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Lưu phiếu
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
