export interface Menu {
  menu_id: number; // Mapped from backend mm_id
  mm_name: string;
  mm_code: string;
  mm_description: string;
  mm_start_time: string;      // "HH:MM" 24h format
  mm_end_time: string;
  mm_available_days: string[]; // e.g. ["monday","tuesday"]
  mm_sort_order: number;
  mm_theme_color: string;      // hex color "#F97316"
  mm_is_default: boolean;
  mm_created_at?: string;
  mm_updated_at?: string;
}

export interface MenuFormData {
  menu_id?: number;
  mm_name: string;
  mm_code: string;
  mm_description: string;
  mm_start_time: string;
  mm_end_time: string;
  mm_available_days: string[];
  mm_sort_order: number;
  mm_theme_color: string;
  mm_is_default: boolean;
}