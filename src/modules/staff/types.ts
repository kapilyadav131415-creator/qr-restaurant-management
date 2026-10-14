import { z } from 'zod';

export const StaffSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role_id: z.number().min(1, 'Please select a role'),
});

export const UpdateStaffSchema = z.object({
  staff_id: z.number().min(1, "Staff ID is missing"), // Required for Update
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  role_id: z.number().min(1, 'Please select a role'),
});

export const ResetPasswordSchema = z.object({
  staff_id: z.number().min(1, "Staff ID is missing"), // Required for Reset
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type CreateStaffDTO = z.infer<typeof StaffSchema>;
export type UpdateStaffDTO = z.infer<typeof UpdateStaffSchema>;
export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

export interface StaffEntity {
  um_id: number;
  um_full_name: string;
  um_username: string;
  um_email: string;
  um_phone: string;
  um_role_id: number;
  um_is_active: boolean;
  um_is_locked: boolean;
  um_created_at: string;
  um_last_login?: string;
  role_name?: string;
}