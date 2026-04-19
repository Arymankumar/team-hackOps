export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: "starter" | "pro" | "premium";
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  image: string;
  images: string[];
  inStock: boolean;
  tags: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type OrderStatus = "processing" | "shipped" | "delivered";

export type Order = {
  id: string;
  userId: string;
  items: { productId: string; quantity: number; price: number; name: string }[];
  total: number;
  status: OrderStatus;
  trackingNumber: string;
  createdAt: string;
};

export type StoreData = {
  users: User[];
  carts: Record<string, CartItem[]>;
  orders: Order[];
  wishlists: Record<string, string[]>;
  userBehavior: Record<string, { viewedProductIds: string[]; categoryClicks: Record<string, number> }>;
};
