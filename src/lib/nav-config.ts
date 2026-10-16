import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Building2,
  LayoutList,
  Package,
  UtensilsCrossed,
  ArrowRightLeft,
} from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  group: "Tổng quan" | "Nghiệp vụ" | "Danh mục"
  description?: string
}

export const navItems: NavItem[] = [
  {
    href: "/tong-quan",
    label: "Tổng quan",
    icon: LayoutDashboard,
    group: "Tổng quan",
    description: "Bảng điều khiển toàn hệ thống",
  },
  {
    href: "/nhap-xuat-kho",
    label: "Nhập / Xuất kho",
    icon: ArrowRightLeft,
    group: "Nghiệp vụ",
    description: "Ghi nhận nhập, xuất nguyên liệu theo chi nhánh",
  },
  {
    href: "/chi-nhanh",
    label: "Chi nhánh",
    icon: Building2,
    group: "Danh mục",
    description: "Quản lý nhà hàng / chi nhánh",
  },
  {
    href: "/danh-muc",
    label: "Danh mục",
    icon: LayoutList,
    group: "Danh mục",
    description: "Danh mục nguyên liệu & món ăn",
  },
  {
    href: "/nguyen-lieu",
    label: "Nguyên liệu",
    icon: Package,
    group: "Danh mục",
    description: "Nguyên liệu, đơn vị tính, định mức tồn tối thiểu",
  },
  {
    href: "/mon-an",
    label: "Món ăn",
    icon: UtensilsCrossed,
    group: "Danh mục",
    description: "Thực đơn / món ăn theo danh mục",
  },
]

export const navGroups: NavItem["group"][] = ["Tổng quan", "Nghiệp vụ", "Danh mục"]
