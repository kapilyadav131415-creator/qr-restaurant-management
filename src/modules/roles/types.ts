export interface Role {
  role_id: number;
  role_name: string;
  role_description: string;
  role_is_system: boolean;
  role_is_active: boolean;
  role_created_at?: string;
  role_updated_at?: string;
}

export interface RoleFormData {
  role_id?: number;
  role_name: string;
  role_description: string;
  role_is_active: boolean;
}