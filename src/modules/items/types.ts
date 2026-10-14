import { z } from 'zod';

// ==========================================
// ITEM TYPES
// ==========================================
export const ItemFormSchema = z.object({
  item_id: z.number().optional(),
  menu_id: z.number().min(1, "Menu is required"),
  category_id: z.number().min(1, "Category is required"),
  branch_id: z.number().optional().nullable(),
  name: z.string().min(2, "Item name is required").max(200),
  code: z.string().optional().nullable(),
  short_description: z.string().max(500).optional().nullable(),
  description: z.string().optional().nullable(),
  food_type: z.enum(['veg', 'nonveg', 'vegan', 'jain', 'egg']).optional(),
  image_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal('')),
  banner_image_url: z.string().url("Must be a valid URL").optional().nullable().or(z.literal('')),
  sort_order: z.number().optional(),
  preparation_time: z.number().optional(),
  is_featured: z.boolean().optional(),
  is_recommended: z.boolean().optional(),
  is_spicy: z.boolean().optional(),
  is_bestseller: z.boolean().optional(),
  is_new: z.boolean().optional(),
  is_available: z.boolean().optional(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable()
});

export type ItemFormData = z.infer<typeof ItemFormSchema>;

export interface ItemEntity {
  im_id: number;
  im_name: string;
  im_code: string;
  im_slug: string;
  im_short_description: string | null;
  im_description: string | null;
  im_food_type: 'veg' | 'nonveg' | 'vegan' | 'jain' | 'egg';
  im_image_url: string | null;
  im_banner_image_url: string | null;
  im_sort_order: number;
  im_preparation_time: number;
  im_is_featured: boolean;
  im_is_recommended: boolean;
  im_is_spicy: boolean;
  im_is_bestseller: boolean;
  im_is_new: boolean;
  im_is_available: boolean;
  im_meta_title: string | null;
  im_meta_description: string | null;
  menu_id: number;
  menu_name?: string;
  category_id: number;
  category_name?: string;
  branch_id?: number | null;
  branch_name?: string;
}

// ==========================================
// VARIANT TYPES (UPDATED FOR NEW API)
// ==========================================
export const VariantFormSchema = z.object({
  variant_id: z.number().optional(),
  item_id: z.number().min(1, "Item ID is required"),
  variant_name: z.string().min(1, "Variant name is required"),
  variant_code: z.string().optional().nullable(),
  price: z.number().min(0, "Price cannot be negative"),
  discount_price: z.number().min(0).optional().nullable(),
  sort_order: z.number().optional(),
  is_default: z.boolean().optional(),
  is_available: z.boolean().optional(),
});

export type VariantFormData = z.infer<typeof VariantFormSchema>;

export interface VariantEntity {
  variant_id: number;
  item_id: number;
  variant_name: string;
  variant_code: string;
  price: number;
  discount_price: number;
  sort_order: number;
  is_default: boolean;
  is_available: boolean;
}