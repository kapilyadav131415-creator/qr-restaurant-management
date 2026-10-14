export interface ReportFilters {
  start_date?: string;
  end_date?: string;
  status?: string;
  branch_id?: string;
  page?: number;
  limit?: number;
}

export interface ReportResponse<T> {
  data: T[];
  total: number;
}

export interface OrderItemAddon {
  name: string;
  qty: number;
  price: string;
}

export interface OrderItem {
  item_name: string;
  qty: number;
  price: string;
  addons?: OrderItemAddon[];
}

export interface OrderReportItem {
  om_id: number;
  branch_id: number;
  table_id: string;
  customer_name: string;
  order_type: string;
  om_status: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
}

export interface BillingItem {
  item_name: string;
  qty: number;
  price: string;
  total: string;
}

export interface BillingReportItem {
  bill_id: number;
  branch_id: number;
  table_id: string;
  bill_number: string;
  subtotal: string;
  discount_amount: string;
  grand_total: string;
  payment_status: string;
  bill_status: string;
  created_at: string;
  items: BillingItem[];
}

export interface PaymentReportItem {
  payment_id: number;
  bill_number: string;
  payment_mode: string;
  amount: string;
  payment_status: string;
  created_at: string;
  branch_id: number;
}
