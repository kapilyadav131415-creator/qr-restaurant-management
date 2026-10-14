import { z } from 'zod';

// ==========================================
// ADDON GROUP
// ==========================================
export const AddonGroupSchema = z.object({
  group_id: z.number().optional(),
  item_id: z.number().min(1, 'Item ID is required'),
  name: z.string().min(2, 'Group name is required'),
  code: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  selection_type: z.enum(['single', 'multiple']).default('multiple'),
  min_select: z.number().min(0).default(0),
  max_select: z.number().min(1).default(1),
  is_required: z.boolean().default(false),
  sort_order: z.number().default(0),
});

export type AddonGroupFormData = z.input<typeof AddonGroupSchema>;

export interface AddonGroupEntity {
  ag_id: number;
  item_id: number;
  ag_name: string;
  ag_code: string | null;
  ag_description: string | null;
  ag_selection_type: 'single' | 'multiple';
  ag_min_select: number;
  ag_max_select: number;
  ag_is_required: boolean;
  ag_sort_order: number;
}

// ==========================================
// ADDON ITEM
// ==========================================
export const AddonItemSchema = z.object({
  addon_item_id: z.number().optional(),
  group_id: z.number().min(1, 'Group ID is required'),
  name: z.string().min(2, 'Addon name is required'),
  code: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number().min(0, 'Price cannot be negative'),
  discount_price: z.number().nullable().optional(),
  image_url: z.string().url('Invalid image URL').nullable().optional().or(z.literal('')),
  stock_qty: z.number().min(0).default(100),
  sort_order: z.number().default(0),
  is_available: z.boolean().default(true),
});

export type AddonItemFormData = z.input<typeof AddonItemSchema>;

export interface AddonItemEntity {
  ai_id: number;
  group_id: number;
  ai_name: string;
  ai_code: string | null;
  ai_description: string | null;
  ai_price: number;
  ai_discount_price: number | null;
  ai_image_url: string | null;
  ai_stock_qty: number;
  ai_sort_order: number;
  ai_is_available: boolean;
}