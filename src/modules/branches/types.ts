export interface Branch {
  bm_id: number;
  bm_name: string;
  rm_name : string;
  restaurant_id?: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BranchFormData {
  bm_id?: number;
  bm_name: string;
}