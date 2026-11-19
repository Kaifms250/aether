import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type CheckoutItem = { product_id: string; quantity: number };
export type ShippingAddress = {
  full_name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};
export type CheckoutState = {
  items: CheckoutItem[];
  shipping_address?: ShippingAddress;
  coupon_code?: string | null;
  request_id?: string;
  clear_cart?: boolean;
};

export function parseCheckoutState(value: unknown): CheckoutState | null {
  if (!value || typeof value !== "object") return null;
  const state = value as Record<string, unknown>;
  if (!Array.isArray(state.items) || state.items.length < 1 || state.items.length > 50) return null;
  const items = state.items.filter(
    (item): item is CheckoutItem =>
      !!item &&
      typeof item === "object" &&
      typeof (item as Record<string, unknown>).product_id === "string" &&
      Number.isInteger((item as Record<string, unknown>).quantity) &&
      Number((item as Record<string, unknown>).quantity) > 0,
  );
  if (items.length !== state.items.length) return null;

  const addressValue = state.shipping_address;
  let shipping_address: ShippingAddress | undefined;
  if (addressValue !== undefined) {
    if (!addressValue || typeof addressValue !== "object") return null;
    const address = addressValue as Record<string, unknown>;
    const fields = [
      "full_name",
      "email",
      "phone",
      "line1",
      "line2",
      "city",
      "state",
      "postal_code",
      "country",
    ];
    if (fields.some((field) => typeof address[field] !== "string")) return null;
    shipping_address = address as ShippingAddress;
  }

  return {
    items,
    shipping_address,
    coupon_code: typeof state.coupon_code === "string" ? state.coupon_code : null,
    request_id: typeof state.request_id === "string" ? state.request_id : undefined,
    clear_cart: state.clear_cart === true,
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("storefront_catalog", true);
      if (error) throw error;
      return data;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export async function addProductToCart(productId: string, quantity = 1) {
  const { error } = await supabase.rpc("add_to_cart", {
    p_product_id: productId,
    p_quantity: quantity,
  });
  if (error) throw error;
  window.dispatchEvent(new Event("aether-cart-updated"));
}

export const formatPrice = (amount: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
