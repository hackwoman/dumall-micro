// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin?: boolean;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 商品相关类型
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 购物车商品类型
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

// 订单相关类型
export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// API响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页类型
export interface PaginationParams {
  page: number;
  size: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
} 