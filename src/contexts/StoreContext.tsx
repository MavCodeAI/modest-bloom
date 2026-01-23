import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, CartItem, QuoteRequest, Order, initialProducts } from '@/lib/data';
import { StoreState, StoreAction, initialState, STORAGE_KEYS } from '@/lib/store-types';

// Reducer
function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };

    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };

    case 'ADD_TO_CART': {
      const { product, size, quantity } = action.payload;
      const existingIndex = state.cart.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      if (existingIndex >= 0) {
        const newCart = [...state.cart];
        newCart[existingIndex].quantity += quantity;
        return { ...state, cart: newCart };
      }

      return {
        ...state,
        cart: [...state.cart, { product, size, quantity }],
      };
    }

    case 'UPDATE_CART_ITEM': {
      const { productId, size, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(
            item => !(item.product.id === productId && item.size === size)
          ),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(
          item =>
            !(item.product.id === action.payload.productId &&
              item.size === action.payload.size)
        ),
      };

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'TOGGLE_CART':
      return {
        ...state,
        isCartOpen: action.payload !== undefined ? action.payload : !state.isCartOpen,
      };

    case 'ADD_QUOTE':
      return { ...state, quotes: [...state.quotes, action.payload] };

    case 'UPDATE_QUOTE_STATUS':
      return {
        ...state,
        quotes: state.quotes.map(q =>
          q.id === action.payload.id ? { ...q, status: action.payload.status } : q
        ),
      };

    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? { ...o, status: action.payload.status } : o
        ),
      };

    case 'TOGGLE_WISHLIST_ITEM': {
      const productId = action.payload;
      const isInWishlist = state.wishlist.includes(productId);
      return {
        ...state,
        wishlist: isInWishlist
          ? state.wishlist.filter(id => id !== productId)
          : [...state.wishlist, productId],
      };
    }

    default:
      return state;
  }
}

// Context
interface StoreContextType extends StoreState {
  dispatch: React.Dispatch<StoreAction>;
  // Computed values
  cartTotal: number;
  cartCount: number;
  // Helper functions
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getProductsByTag: (tag: string) => Product[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export { StoreContext };

// Provider component
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Initialize from localStorage on mount
  useEffect(() => {
    // Load products (or seed with initial data)
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (storedProducts) {
      dispatch({ type: 'SET_PRODUCTS', payload: JSON.parse(storedProducts) });
    } else {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      dispatch({ type: 'SET_PRODUCTS', payload: initialProducts });
    }

    // Load cart
    const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (storedCart) {
      const cartItems = JSON.parse(storedCart);
      cartItems.forEach((item: CartItem) => {
        dispatch({
          type: 'ADD_TO_CART',
          payload: { product: item.product, size: item.size, quantity: item.quantity },
        });
      });
    }

    // Load quotes
    const storedQuotes = localStorage.getItem(STORAGE_KEYS.QUOTES);
    if (storedQuotes) {
      JSON.parse(storedQuotes).forEach((quote: QuoteRequest) => {
        dispatch({ type: 'ADD_QUOTE', payload: quote });
      });
    }

    // Load orders
    const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (storedOrders) {
      JSON.parse(storedOrders).forEach((order: Order) => {
        dispatch({ type: 'ADD_ORDER', payload: order });
      });
    }

    // Load wishlist
    const storedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (storedWishlist) {
      const wishlist = JSON.parse(storedWishlist);
      wishlist.forEach((productId: string) => {
        dispatch({ type: 'TOGGLE_WISHLIST_ITEM', payload: productId });
      });
    }
  }, []);

  // Persist products to localStorage
  useEffect(() => {
    if (state.products.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(state.products));
    }
  }, [state.products]);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.cart));
  }, [state.cart]);

  // Persist quotes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(state.quotes));
  }, [state.quotes]);

  // Persist orders to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(state.orders));
  }, [state.orders]);

  // Persist wishlist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  // Computed values
  const cartTotal = state.cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = state.cart.reduce((count, item) => count + item.quantity, 0);

  // Helper functions
  const getProductById = (id: string) => state.products.find(p => p.id === id);

  const getProductsByCategory = (category: string) =>
    state.products.filter(p => p.category === category);

  const getProductsByTag = (tag: string) =>
    state.products.filter(p => p.tags.includes(tag));

  const value: StoreContextType = {
    ...state,
    dispatch,
    cartTotal,
    cartCount,
    getProductById,
    getProductsByCategory,
    getProductsByTag,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
