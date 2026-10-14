export interface OrderAddon {
  name: string;
  qty: number;
}

export interface OrderItem {
  item_id: number;
  name: string;
  variant: string | null; // <--- NEW FIELD
  qty: number;
  status: string;
  note: string | null;
  addons: OrderAddon[];
}

export interface KitchenOrder {
  om_id: number;
  order_no: string;
  om_table_id: number | null;
  om_order_type: 'dinein' | 'takeaway' | 'delivery';
  om_status: 'received' | 'preparing' | 'food_ready' | 'served';
  om_notes: string | null;
  om_created_at: string;
  items: OrderItem[];
}