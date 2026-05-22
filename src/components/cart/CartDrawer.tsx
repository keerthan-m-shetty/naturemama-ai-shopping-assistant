"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, clearCart, itemCount, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-earth-900/40 backdrop-blur-sm z-[60]"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        className="fixed top-0 right-0 h-full w-[380px] max-w-[90vw] bg-white shadow-2xl z-[70]
                   flex flex-col animate-slide-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-natural-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-sage-600" />
            <h2 className="font-serif text-lg text-earth-900">Your Cart</h2>
            <span className="text-xs bg-sage-100 text-sage-700 font-medium px-2 py-0.5 rounded-full">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full hover:bg-natural-100 flex items-center justify-center
                       transition-colors duration-150"
          >
            <X size={18} className="text-earth-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-natural-300 mb-4" />
              <p className="text-earth-600 font-medium">Your cart is empty</p>
              <p className="text-earth-400 text-sm mt-1">
                Ask the AI assistant to add products!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId + (item.variantId || "")}
                  className="flex gap-3 p-3 bg-natural-50 rounded-xl border border-natural-200"
                >
                  {/* Product emoji placeholder */}
                  <div className="w-12 h-12 rounded-lg bg-sage-100 flex items-center justify-center shrink-0 text-lg">
                    🌿
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-earth-900 text-sm truncate">{item.name}</p>
                    <p className="text-sage-600 text-sm font-medium mt-0.5">
                      €{item.price.toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.productId, item.quantity - 1, item.variantId)}
                        aria-label="Decrease quantity"
                        className="w-6 h-6 rounded-md border border-natural-300 flex items-center justify-center
                                   hover:bg-natural-200 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium text-earth-800 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.quantity + 1, item.variantId)}
                        aria-label="Increase quantity"
                        className="w-6 h-6 rounded-md border border-natural-300 flex items-center justify-center
                                   hover:bg-natural-200 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Remove + line total */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label={`Remove ${item.name}`}
                      className="w-6 h-6 rounded-md hover:bg-red-50 flex items-center justify-center
                                 text-earth-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <p className="text-sm font-semibold text-earth-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-natural-200 px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-earth-600 text-sm">Subtotal</span>
              <span className="font-serif text-xl text-earth-900">€{subtotal.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-sage-500 hover:bg-sage-600 text-white font-medium
                         py-3 rounded-xl transition-colors duration-200"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full text-earth-500 hover:text-red-500 text-sm font-medium
                         py-2 transition-colors duration-200"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
