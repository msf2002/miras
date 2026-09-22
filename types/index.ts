import type {
  Product,
  ProductImage,
  ProductVariant,
  Size,
  Color,
  Review,
  Order,
  OrderItem,
  Cart,
  CartItem,
  User,
  Address,
  Coupon,
} from "@prisma/client";

// Product with relations
export type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: (ProductVariant & {
    size: Size;
    color: Color;
  })[];
  reviews: Review[];
  _count?: { reviews: number };
};

export type ProductCardData = Product & {
  images: ProductImage[];
  variants: (ProductVariant & {
    size: Size;
    color: Color;
  })[];
};

// Cart with relations
export type CartWithItems = Cart & {
  items: (CartItem & {
    variant: ProductVariant & {
      size: Size;
      color: Color;
      product: Product & {
        images: ProductImage[];
      };
    };
  })[];
};

// Order with relations
export type OrderWithItems = Order & {
  items: (OrderItem & {
    variant:
      | (ProductVariant & {
          size: Size;
          color: Color;
          product: Product;
        })
      | null;
  })[];
  address: Address | null;
  coupon: Coupon | null;
};

// Filter types
export type ProductFilters = {
  search?: string;
  productNames?: string[];
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
  page?: number;
  limit?: number;
};

// API Response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Dashboard stats
export type DashboardStats = {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  newOrders: number;
  lowStockProducts: number;
  topProducts: { name: string; sales: number }[];
  recentOrders: OrderWithItems[];
  salesChart: { date: string; amount: number }[];
};
