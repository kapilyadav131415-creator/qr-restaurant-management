// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { cartApi } from '../api/cartApi';
import type { ServerCart, ServerCartItem, TableInfo, CartAddon } from '../types';

interface CartContextType {
  cart: ServerCart | null;
  isSyncing: boolean;
  customerInfo: { name: string; mobile: string } | null;
  setCustomerInfo: (name: string, mobile: string) => void;
  initCartSession: (table: TableInfo) => void;
  addItemToCart: (itemData: any, addonsData: any[]) => Promise<void>;
  updateItemQty: (cartItemId: number, newQty: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  clearActiveOrders?: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ServerCart | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [customerInfo, setCustomerInfoState] = useState<{ name: string; mobile: string } | null>(null);

  // Load saved cart and customer info only once on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('qr_cart_session');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
        console.log('Loaded saved cart:', parsed);
      } catch (e) {
        localStorage.removeItem('qr_cart_session');
      }
    }

    // Load customer info
    const savedCustomer = localStorage.getItem('qr_customer_info');
    if (savedCustomer) {
      try {
        setCustomerInfoState(JSON.parse(savedCustomer));
        console.log('Loaded customer info:', JSON.parse(savedCustomer));
      } catch (e) {
        localStorage.removeItem('qr_customer_info');
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (cart) {
      localStorage.setItem('qr_cart_session', JSON.stringify(cart));
    } else {
      localStorage.removeItem('qr_cart_session');
    }
  }, [cart]);

  // Save customer info to localStorage
  useEffect(() => {
    if (customerInfo) {
      localStorage.setItem('qr_customer_info', JSON.stringify(customerInfo));
    }
  }, [customerInfo]);

  const setCustomerInfo = useCallback((name: string, mobile: string) => {
    const info = { name, mobile };
    setCustomerInfoState(info);
    localStorage.setItem('qr_customer_info', JSON.stringify(info));
    console.log('Customer info set:', info);
  }, []);

  const initCartSession = useCallback((table: TableInfo) => {
    console.log('=== INIT CART SESSION ===');
    console.log('Table info received:', table);
    
    setTableInfo(table);
    
    if (!cart) {
      const newCart = {
        restaurant_id: Number(table.restaurantId),
        branch_id: Number(table.branchId),
        table_id: Number(table.id),
        session_id: Math.random().toString(36).substring(2, 15),
        items: []
      };
      console.log('New cart session created:', newCart);
      setCart(newCart);
    } else {
      console.log('Cart already exists:', cart);
    }
  }, [cart]);

  const getOrCreateCartId = useCallback(async () => {
    console.log('=== GET OR CREATE CART ID ===');
    console.log('Current cart state:', cart);
    console.log('Customer info:', customerInfo);
    
    if (cart?.cm_id) {
      console.log('Cart already has ID:', cart.cm_id);
      return cart.cm_id;
    }
    
    if (!tableInfo || !cart) {
      console.error('Missing tableInfo or cart');
      throw new Error("Session not initialized");
    }
    
    const restaurantId = Number(cart.restaurant_id || tableInfo.restaurantId);
    const branchId = Number(cart.branch_id || tableInfo.branchId);
    const tableId = Number(cart.table_id || tableInfo.id);
    
    console.log('Using values:', { restaurantId, branchId, tableId });
    
    if (!restaurantId || !branchId || !tableId) {
      console.error('Invalid IDs:', { restaurantId, branchId, tableId });
      throw new Error("Invalid restaurant, branch, or table ID");
    }
    
    const cartData = {
      p_cm_restaurant_id: restaurantId,
      p_cm_branch_id: branchId,
      p_cm_table_id: tableId,
      p_cm_session_id: cart.session_id,
      p_cm_order_type: 'dinein',
      p_cm_customer_name: customerInfo?.name || null,
      p_cm_customer_mobile: customerInfo?.mobile || null,
      p_cm_notes: null,
      p_cm_created_by: null
    };
    
    console.log('Sending to API with customer info:', cartData);
    
    try {
      const cartId = await cartApi.createCart(cartData);
      console.log('Cart created with ID:', cartId);
      
      setCart(prev => prev ? { ...prev, cm_id: cartId } : null);
      return cartId;
    } catch (error) {
      console.error('Failed to create cart:', error);
      throw error;
    }
  }, [cart, tableInfo, customerInfo]);

  const addItemToCart = useCallback(async (itemData: any, addonsData: any[]) => {
    setIsSyncing(true);
    try {
      const cartId = await getOrCreateCartId();
      
      const itemPayload = {
        p_ci_cart_id: cartId,
        p_ci_restaurant_id: Number(cart!.restaurant_id),
        p_ci_item_id: Number(itemData.item_id),
        p_ci_variant_id: Number(itemData.variant_id),
        p_ci_item_name: String(itemData.item_name),
        p_ci_variant_name: String(itemData.variant_name),
        p_ci_price: Number(itemData.price),
        p_ci_discount_price: Number(itemData.discount_price || 0),
        p_ci_final_price: Number(itemData.final_price || itemData.price),
        p_ci_qty: Number(itemData.qty),
        p_ci_total_amount: Number((itemData.final_price || itemData.price) * itemData.qty),
        p_ci_special_note: null
      };
      
      console.log('Adding item with payload:', itemPayload);
      
      const cartItemId = await cartApi.addItem(itemPayload);
      console.log('Item added with ID:', cartItemId);

      const syncedAddons: CartAddon[] = [];
      for (const addon of addonsData) {
        const addonPayload = {
          p_cia_cart_item_id: Number(cartItemId),
          p_cia_restaurant_id: Number(cart!.restaurant_id),
          p_cia_addon_group_id: Number(addon.addon_group_id),
          p_cia_addon_item_id: Number(addon.addon_item_id),
          p_cia_addon_name: String(addon.addon_name),
          p_cia_price: Number(addon.price),
          p_cia_qty: Number(addon.qty),
          p_cia_total_amount: Number(addon.price * addon.qty)
        };
        
        console.log('Adding addon with payload:', addonPayload);
        
        const addonId = await cartApi.addAddon(addonPayload);
        syncedAddons.push({ ...addon, cia_id: addonId });
      }

      setCart(prev => {
        if (!prev) return prev;
        const newItem: ServerCartItem = {
          ...itemData,
          ci_id: cartItemId,
          addons: syncedAddons,
          total_amount: (itemData.final_price || itemData.price) * itemData.qty
        };
        return {
          ...prev,
          items: [...prev.items, newItem]
        };
      });

      toast.success('Item added to cart!');
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to add item. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  }, [cart, getOrCreateCartId]);

  // Define removeItem first
  const removeItem = useCallback(async (cartItemId: number) => {
    if (!cartItemId) {
      console.error('Invalid cartItemId');
      return;
    }

    console.log(`Removing item ${cartItemId}`);
    
    setCart(prev => {
      if (!prev) return prev;
      return { 
        ...prev, 
        items: prev.items.filter(item => item.ci_id !== cartItemId) 
      };
    });

    try {
      await cartApi.removeItem(cartItemId);
      toast.success('Item removed');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  }, []);

  
const clearActiveOrders = useCallback(() => {
  localStorage.removeItem('active_orders');
}, []);
  // Then define updateItemQty which uses removeItem
  const updateItemQty = useCallback(async (cartItemId: number, newQty: number) => {
    if (!cartItemId) {
      console.error('Invalid cartItemId');
      return;
    }

    if (newQty <= 0) {
      await removeItem(cartItemId);
      return;
    }
    
    console.log(`Updating item ${cartItemId} to quantity ${newQty}`);
    
    setCart(prev => {
      if (!prev) return prev;
      const updatedItems = prev.items.map(item => {
        if (item.ci_id === cartItemId) {
          const finalPrice = item.final_price || item.price || 0;
          const updatedItem = {
            ...item,
            qty: newQty,
            total_amount: finalPrice * newQty
          };
          if (updatedItem.addons && updatedItem.addons.length > 0) {
            updatedItem.addons = updatedItem.addons.map(addon => ({
              ...addon,
              total_amount: addon.price * newQty
            }));
          }
          return updatedItem;
        }
        return item;
      });
      
      return {
        ...prev,
        items: updatedItems
      };
    });

    try {
      await cartApi.updateItemQty(cartItemId, newQty);
      console.log('Quantity updated successfully on backend');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setCart(null);
    localStorage.removeItem('qr_cart_session');
    // Don't clear customer info - keep it for next order
  }, []);

  const cartTotal = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => {
      const itemTotal = (item.final_price || item.price || 0) * (item.qty || 0);
      const addonsTotal = item.addons?.reduce((aSum, a) => aSum + ((a.price || 0) * (a.qty || 0)), 0) || 0;
      return sum + itemTotal + addonsTotal;
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + (item.qty || 0), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      isSyncing, 
      customerInfo,
      setCustomerInfo,
      initCartSession, 
      addItemToCart, 
      updateItemQty, 
      removeItem, 
      clearCart,
      cartTotal, 
      cartItemCount ,
      clearActiveOrders
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};