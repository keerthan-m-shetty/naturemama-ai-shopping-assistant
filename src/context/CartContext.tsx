"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export interface CartLineItem {
  productId:   string;
  variantId?:  string;
  name:        string;
  variantName?: string;
  price:       number;
  quantity:    number;
  imageKey?:   string;
  slug:        string;
}

interface CartState {
  items:     CartLineItem[];
  isOpen:    boolean;
}

type CartAction =
  | { type: "ADD_ITEM";    payload: CartLineItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variantId?: string } }
  | { type: "UPDATE_QTY";  payload: { productId: string; variantId?: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "HYDRATE";     payload: CartLineItem[] };

// ── Helpers ────────────────────────────────────────────────────────────────

const itemKey = (productId: string, variantId?: string) =>
  variantId ? `${productId}::${variantId}` : productId;

// ── Reducer ────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.payload };

    case "ADD_ITEM": {
      const key = itemKey(action.payload.productId, action.payload.variantId);
      const existing = state.items.find(
        (i) => itemKey(i.productId, i.variantId) === key
      );
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            itemKey(i.productId, i.variantId) === key
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { ...state, isOpen: true, items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM": {
      const key = itemKey(action.payload.productId, action.payload.variantId);
      return {
        ...state,
        items: state.items.filter(
          (i) => itemKey(i.productId, i.variantId) !== key
        ),
      };
    }

    case "UPDATE_QTY": {
      const key = itemKey(action.payload.productId, action.payload.variantId);
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => itemKey(i.productId, i.variantId) !== key
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          itemKey(i.productId, i.variantId) === key
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface CartContextValue {
  items:       CartLineItem[];
  isOpen:      boolean;
  itemCount:   number;
  subtotal:    number;
  addItem:     (item: CartLineItem) => void;
  removeItem:  (productId: string, variantId?: string) => void;
  updateQty:   (productId: string, quantity: number, variantId?: string) => void;
  clearCart:   () => void;
  toggleCart:  () => void;
  openCart:    () => void;
  closeCart:   () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "nm_cart";

// ── Provider ───────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        dispatch({ type: "HYDRATE", payload: JSON.parse(stored) });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addItem    = useCallback((item: CartLineItem) => dispatch({ type: "ADD_ITEM",    payload: item }), []);
  const removeItem = useCallback((productId: string, variantId?: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { productId, variantId } }), []);
  const updateQty  = useCallback((productId: string, quantity: number, variantId?: string) =>
    dispatch({ type: "UPDATE_QTY",  payload: { productId, variantId, quantity } }), []);
  const clearCart  = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);
  const openCart   = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart  = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal  = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
