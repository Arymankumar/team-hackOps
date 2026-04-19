export type Plan = "starter" | "pro" | "premium";

export type User = {
  id: string;
  email: string;
  name: string;
  plan: Plan;
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

export type Review = {
  author: string;
  rating: number;
  text: string;
  date: string;
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

export type Deal = {
  id: string;
  title: string;
  discount: string;
  endsAt: string;
  code: string;
};
