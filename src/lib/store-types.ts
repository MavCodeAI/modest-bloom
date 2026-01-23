import { Product, CartItem, QuoteRequest, Order } from '@/lib/data';

// Storage keys
export const STORAGE_KEYS = {
  PRODUCTS: 'mw_products',
  CART: 'mw_cart',
  QUOTES: 'mw_quotes',
  ORDERS: 'mw_orders',
  WISHLIST: 'mw_wishlist',
} as const;

// State interface
export interface StoreState {
  products: Product[];
  cart: CartItem[];
  quotes: QuoteRequest[];
  orders: Order[];
  isCartOpen: boolean;
  wishlist: string[];
}

// Action types
export type StoreAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { product: Product; size: string; quantity: number } }
  | { type: 'UPDATE_CART_ITEM'; payload: { productId: string; size: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; size: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART'; payload?: boolean }
  | { type: 'ADD_QUOTE'; payload: QuoteRequest }
  | { type: 'UPDATE_QUOTE_STATUS'; payload: { id: string; status: QuoteRequest['status'] } }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'TOGGLE_WISHLIST_ITEM'; payload: string };

// Initial state
export const initialState: StoreState = {
  products: [],
  cart: [],
  quotes: [],
  orders: [],
  isCartOpen: false,
  wishlist: [],
};
