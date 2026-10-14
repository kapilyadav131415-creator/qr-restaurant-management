export interface TableInfo {
  id: number;
  tableName: string;
  restaurantId: number;
  branchId: number;
  restaurantName: string;
  restaurantLogo: string | null;
  branchName: string;
}

export interface Menu {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  themeColor: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  isRecommended: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  type: 'veg' | 'nonveg' | 'egg' | 'vegan' | 'jain';
  isBestseller: boolean;
  isRecommended: boolean;
  prepTime: number | null;
}

export interface ItemVariant {
  id: number;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface AddonItem {
  id: number;
  name: string;
  price: number;
}

export interface AddonGroup {
  id: number;
  name: string;
  selectionType: 'single' | 'multiple';
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  items: AddonItem[];
}

export interface ItemDetails {
  item: MenuItem;
  variants: ItemVariant[];
  addonGroups: AddonGroup[];
}

export interface CartAddon {
  cia_id?: number;
  addon_group_id: number;
  addon_item_id: number;
  addon_name: string;
  price: number;
  qty: number;
}

export interface ServerCartItem {
  ci_id?: number;
  item_id: number;
  variant_id: number;
  item_name: string;
  variant_name: string;
  price: number;
  discount_price: number;
  final_price: number;
  qty: number;
  total_amount?: number;
  special_note?: string;
  addons: CartAddon[];
  image_url?: string | null;
  food_type?: string;
}

export interface ServerCart {
  cm_id?: number;
  restaurant_id: number;
  branch_id: number;
  table_id: number;
  customer_name?: string;
  customer_mobile?: string;
  session_id: string;
  items: ServerCartItem[];
}