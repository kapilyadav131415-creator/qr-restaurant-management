export interface BillItem {
  bill_item_id: number;
  item_name: string;
  variant_name?: string;
  qty: number;
  price: string;
  final_price: string;
  total_amount: string;
}

export interface PaymentRecord {
  payment_id: number;
  payment_mode: string;
  amount: string;
  payment_status: string;
  created_at: string;
}

export interface BillMaster {
  bill_id: number;
  bill_number: string;
  restaurant_id: number;
  table_id?: number;
  order_id: number;
  subtotal: string;
  discount_amount: string;
  service_charge: string;
  gst_amount: string;
  cgst: string;
  sgst: string;
  round_off: string;
  grand_total: string;
  payment_status: 'Pending' | 'Paid' | 'Partial';
  bill_status: 'Open' | 'Closed' | 'Cancelled';
  created_at: string;
  items: BillItem[];
  payments: PaymentRecord[];
}
