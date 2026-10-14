import { z } from 'zod';

// Zod Validation Schema matching your Backend API
export const TableFormSchema = z.object({
  table_id: z.number().optional(), // Used only for updates
  branch_id: z.number().min(1, "Please select a branch"),
  table_name: z.string().min(2, "Table Name is required").max(50),
  table_code: z.string().min(1, "Table Code is required").max(20),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  floor_name: z.string().optional(),
  section_name: z.string().optional(),
  table_type: z.enum(["dinein", "takeaway", "outdoor", "vip"]),
  shape: z.enum(["square", "rectangle", "circle"]), // Added strict shape types
});

export type TableFormData = z.infer<typeof TableFormSchema>;

export interface TableEntity {
  tm_id: number;
  tm_table_name: string;
  tm_table_code: string;
  branch_id: number;
  branch_name: string;
  tm_capacity: number;
  tm_floor_name: string;
  tm_section_name: string;
  tm_status: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'inactive';
  tm_table_type: 'dinein' | 'takeaway' | 'outdoor' | 'vip';
  tm_shape: 'square' | 'rectangle' | 'circle'; // Matches database
  tm_qr_code: string | null;
  tm_qr_image_url?: string | null; // 👇 Added URL field
}