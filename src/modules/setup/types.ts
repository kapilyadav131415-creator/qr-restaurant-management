export interface PlanFeatures {
  [key: string]: boolean | undefined;
}

export interface SubscriptionPlan {
  spm_id: string | number;
  spm_name: string;
  spm_code: string;
  spm_price: string;
  spm_duration_days: number;
  spm_max_tables: number;
  spm_max_branches: number;
  spm_max_users: number;
  spm_features: PlanFeatures;
  spm_is_trial: boolean;
}

export interface RestaurantSetupFormData {
  p_rm_name: string;
  p_rm_legal_name: string;
  p_rm_owner_name: string;
  p_rm_owner_phone: string;
  p_rm_owner_email: string;
  p_rm_contact_phone: string;
  p_rm_contact_email: string;
  p_rm_address_line1: string;
  p_rm_address_line2: string;
  p_rm_city: string;
  p_rm_state: string;
  p_rm_country: string;
  p_rm_postal_code: string;
  p_rm_gst_number: string;
  p_rm_fssai_license: string;
  p_rm_website: string;
  p_rm_timezone: string;
  p_rm_currency: string;
  p_plan_id: number;
  p_branch_name: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}