export interface RoleEntity {
  id: number;
  name: string;
}

export interface PermissionItem {
  module_id: number;
  module_name: string;
  can_view: boolean;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_print: boolean;
}

export interface SavePermissionsPayload {
  role_id: number;
  permissions: PermissionItem[];
}