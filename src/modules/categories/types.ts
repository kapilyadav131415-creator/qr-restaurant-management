import { z } from 'zod';

export const CategoryFormSchema = z.object({
  category_id: z.number().optional(),
  menu_id: z.number().min(1, "Please select a Menu"),
  category_name: z.string().min(2, "Category Name is required").max(100),
  category_code: z.string().min(1, "Category Code is required").max(50),
  description: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  banner_image_url: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  sort_order: z.number().optional(),
  is_recommended: z.boolean().optional(),
  slug: z.string().optional().nullable(),
});

// VERY IMPORTANT: Let Zod automatically generate the Type. 
// Do NOT manually write "export interface CategoryFormData {...}"
export type CategoryFormData = z.infer<typeof CategoryFormSchema>;

export interface CategoryEntity {
  cm_id: number;
  cm_name: string;
  cm_code: string;
  cm_description: string;
  cm_image_url: string | null;
  cm_banner_image_url: string | null;
  cm_icon: string | null;
  cm_sort_order: number;
  cm_is_recommended: boolean;
  cm_slug: string;
  menu_id: number;
  menu_name: string;
  cm_created_at?: string;
}