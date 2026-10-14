// src/types/order.ts
export interface OrderItemAddon {
  name: string;
  price: number;
  qty: number;
  total: number;
}

export interface OrderItem {
  item_id: number;
  name: string;
  variant: string;
  price: number;
  qty: number;
  total: number;
  status: string;
  note: string | null;
  addons: OrderItemAddon[];
}

export interface OrderMaster {
  om_id: number;
  order_no: string;
  om_restaurant_id: number;
  om_branch_id: number;
  om_table_id: number;
  om_customer_name: string;
  om_customer_mobile: string;
  om_order_type: string;
  om_status: 'pending' | 'received' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  om_subtotal: number;
  om_tax_amount: number;
  om_discount_amount: number;
  om_delivery_charge: number;
  om_grand_total: number;
  om_notes: string | null;
  om_created_at: string;
  om_updated_at: string;
  items: OrderItem[];
}

export interface KitchenOrder {
  om_id: number;
  order_no: string;
  om_table_id: number;
  om_order_type: string;
  om_status: string;
  om_notes: string | null;
  om_created_at: string;
  items: KitchenOrderItem[];
}

export interface KitchenOrderItem {
  item_id: number;
  name: string;
  qty: number;
  status: string;
  note: string | null;
  addons: { name: string; qty: number }[];
}

export interface PlaceOrderResponse {
  status: string;
  message: string;
  data: {
    order_id: number;
  };
}

export interface OrderDetailsResponse {
  status: string;
  data: OrderMaster;
}

export interface KitchenOrdersResponse {
  status: string;
  data: KitchenOrder[];
}