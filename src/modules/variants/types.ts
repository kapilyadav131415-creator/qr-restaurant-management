import { z } from 'zod';

export const VariantFormSchema = z.object({
  variant_id: z.number().optional(),
  item_id: z.number().min(1, "Item ID is required"),
  name: z.string().min(1, "Variant name is required (e.g., Half, Full)"),
  code: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  price: z.number().min(0, "Price cannot be negative"),
  compare_price: z.number().min(0).optional().nullable(),
  stock_qty: z.number().min(0).optional(),
  sort_order: z.number().optional(),
  is_default: z.boolean().optional(),
  is_available: z.boolean().optional(),
});

export type VariantFormData = z.infer<typeof VariantFormSchema>;

export interface VariantEntity {
  ivm_id: number;
  item_id: number;
  ivm_variant_name: string;
  ivm_variant_code: string;
  ivm_sku: string;
  ivm_price: number;
  ivm_compare_price: number;
  ivm_stock_qty: number;
  ivm_sort_order: number;
  ivm_is_default: boolean;
  ivm_is_available: boolean;
}