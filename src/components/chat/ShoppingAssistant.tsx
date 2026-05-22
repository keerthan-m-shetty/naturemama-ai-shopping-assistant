"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import { MessageCircle, X, Send, Loader2, ShoppingBag, Bot } from "lucide-react";
import { useCart, type CartLineItem } from "@/context/CartContext";
import type { Schema } from "../../../amplify/data/resource";

// ── Amplify client — explicit apiKey auth ──────────────────────────────────
const client = generateClient<Schema>({ authMode: "apiKey" });

// ── Types ──────────────────────────────────────────────────────────────────

interface ChatMessage {
  role:    "user" | "assistant";
  content: string;
}

interface ChatAction {
  type:        string;
  productId?:  string;
  productName?: string;
  price?:      number;
  slug?:       string;
  quantity?:   number;
  path?:       string;
}

interface ProductFromDB {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  productLine?: string | null;
  basePrice: number;
  isOrganic?: boolean | null;
  isColdExtracted?: boolean | null;
  isTraceable?: boolean | null;
  category?: string | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * RAG: Build catalog context string from live DynamoDB products.
 * This is the "Retrieval" step — products are fetched from the database
 * and formatted as plain text to augment the LLM prompt.
 */
function buildCatalogFromDB(products: ProductFromDB[]): string {
  if (products.length === 0) return "No products available.";
  let text = "";
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    text +=
      "- " + p.name +
      " (id: " + p.id + ", slug: " + p.slug + ")" +
      " | " + (p.productLine || "N/A") +
      " | " + p.shortDescription +
      " | EUR " + p.basePrice;
    if (p.isOrganic) text += " | Organic";
    if (p.isColdExtracted) text += " | Cold-Extracted";
    if (p.isTraceable) text += " | Traceable";
    if (p.category) text += " | " + p.category;
    text += "\n";
  }
  return text;
}

/** Build the plain-text cart string sent to the model */
function buildCartContext(items: CartLineItem[]): string {
  if (items.length === 0) return "Cart is empty.";
  let text = "";
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    text += item.name + " (" + item.slug + ") x" + item.quantity + "\n";
  }
  return text;
}

/** Format conversation history as plain text for the model */
function buildConversationText(messages: ChatMessage[]): string {
  let text = "";
  for (let i = 0; i < messages.length; i++) {
    text += messages[i].role + ": " + messages[i].content + "\n";
  }
  return text;
}

/**
 * Defensively parse the model response.
 * Handles double-stringified JSON, markdown fences, and malformed output.
 */
function parseModelResponse(raw: string): { message: string; actions: ChatAction[] } {
  const fallback = { message: raw, actions: [] as ChatAction[] };
  if (!raw) return fallback;

  let text = raw.trim();
  if (text.startsWith('"') && text.endsWith('"')) {
    try { text = JSON.parse(text) as string; } catch { /* leave as-is */ }
  }

  text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  const start = text.indexOf("{");
  const end   = text.lastIndexOf("}");
  if (start === -1 || end === -1) return fallback;

  try {
    const parsed = JSON.parse(text.slice(start, end + 1)) as {
      message?: string;
      actions?: ChatAction[];
    };
    return {
      message: parsed.message ?? text,
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
    };
  } catch {
    return fallback;
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ShoppingAssistant() {
  const router = useRouter();
  const { items, addItem, removeItem, clearCart, openCart } = useCart();

  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi there! 🌿 I'm your NatureMama wellness guide. I can help you find the right supplement, answer questions about our products, or manage your cart. How can I help you today?",
    },
  ]);
  const [input,     setInput]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // RAG: Live product catalog from DynamoDB
  const [catalogContext, setCatalogContext] = useState<string>("Loading products...");
  const [productCount,   setProductCount]  = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  // ── RAG Retrieval: Fetch products from DynamoDB on mount ─────────────────
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: products } = await client.models.Product.list();
        if (products && products.length > 0) {
          const catalog = buildCatalogFromDB(products as unknown as ProductFromDB[]);
          setCatalogContext(catalog);
          setProductCount(products.length);
          console.log("[RAG] Retrieved " + products.length + " products from DynamoDB");
        } else {
          setCatalogContext("No products in database.");
          console.log("[RAG] No products found in database");
        }
      } catch (err) {
        console.error("[RAG] Failed to fetch products:", err);
        setCatalogContext("Product catalog unavailable.");
      }
    }
    fetchProducts();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // ── Execute actions returned by the model ────────────────────────────────
  const executeActions = useCallback(
    (actions: ChatAction[]) => {
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];

        if (action.type === "ADD_TO_CART") {
          if (!action.productId || !action.productName || action.price === undefined) continue;
          const qty = typeof action.quantity === "number" && action.quantity > 0
            ? action.quantity : 1;
          const item: CartLineItem = {
            productId: action.productId,
            name:      action.productName,
            price:     action.price,
            slug:      action.slug ?? action.productId,
            quantity:  qty,
          };
          addItem(item);
        }

        if (action.type === "REMOVE_FROM_CART" && action.productId) {
          removeItem(action.productId);
        }

        if (action.type === "CLEAR_CART") {
          clearCart();
        }

        if (action.type === "NAVIGATE" && action.path) {
          if (action.path === "/cart") {
            openCart();
          } else {
            router.push(action.path);
          }
        }
      }
    },
    [addItem, removeItem, clearCart, openCart, router]
  );

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const conversationText = buildConversationText(updatedMessages);
      const cartText         = buildCartContext(items);

      // RAG: catalogContext comes from live DynamoDB query (fetched on mount)
      const result = await client.queries.chat({
        conversation:   conversationText,
        cartContext:    cartText,
        catalogContext: catalogContext,
      });

      const rawResponse = result.data ?? "";
      const { message, actions } = parseModelResponse(rawResponse);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: message },
      ]);

      if (actions.length > 0) {
        executeActions(actions);
      }
    } catch (err) {
      console.error("[ShoppingAssistant] error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, items, catalogContext, executeActions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating bubble ─────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close shopping assistant" : "Open shopping assistant"}
        className={[
          "fixed bottom-6 right-6 z-50",
          "w-14 h-14 rounded-full shadow-lg",
          "flex items-center justify-center",
          "transition-all duration-300",
          isOpen
            ? "bg-earth-700 hover:bg-earth-800 rotate-0"
            : "bg-sage-500 hover:bg-sage-600 hover:scale-110",
        ].join(" ")}
      >
        {isOpen
          ? <X size={22} className="text-white" aria-hidden="true" />
          : <MessageCircle size={24} className="text-white" aria-hidden="true" />
        }
        {!isOpen && messages.length > 1 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full
                       bg-earth-500 border-2 border-white"
            aria-hidden="true"
          />
        )}
      </button>

      {/* ── Chat panel ──────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-label="Shopping assistant"
        aria-modal="true"
        className={[
          "fixed bottom-24 right-6 z-50",
          "w-[360px] max-w-[calc(100vw-24px)]",
          "flex flex-col",
          "bg-natural-100 rounded-2xl shadow-2xl border border-natural-200",
          "transition-all duration-300 origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none",
        ].join(" ")}
        style={{ height: "480px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-sage-500 rounded-t-2xl shrink-0">
          <div className="w-8 h-8 rounded-full bg-sage-400 flex items-center justify-center shrink-0">
            <Bot size={16} className="text-white" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight">NatureMama Assistant</p>
            <p className="text-sage-200 text-xs">
              RAG: {productCount} products from DB • Nova Pro
            </p>
          </div>
          {items.length > 0 && (
            <div className="flex items-center gap-1.5 bg-sage-400/50 rounded-full px-2.5 py-1">
              <ShoppingBag size={12} className="text-white" aria-hidden="true" />
              <span className="text-white text-xs font-medium">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={[
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              ].join(" ")}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-6 h-6 rounded-full bg-sage-100 border border-sage-200
                             flex items-center justify-center shrink-0 mr-2 mt-0.5"
                  aria-hidden="true"
                >
                  <Bot size={12} className="text-sage-600" />
                </div>
              )}
              <div
                className={[
                  "max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-sage-500 text-white rounded-br-sm"
                    : "bg-white text-earth-800 border border-natural-200 rounded-bl-sm shadow-sm",
                ].join(" ")}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div
                className="w-6 h-6 rounded-full bg-sage-100 border border-sage-200
                           flex items-center justify-center shrink-0 mr-2 mt-0.5"
                aria-hidden="true"
              >
                <Bot size={12} className="text-sage-600" />
              </div>
              <div className="bg-white border border-natural-200 rounded-2xl rounded-bl-sm
                              px-4 py-3 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-400 animate-bounce"
                      style={{ animationDelay: "0ms" }} aria-hidden="true" />
                <span className="w-1.5 h-1.5 rounded-full bg-sage-400 animate-bounce"
                      style={{ animationDelay: "150ms" }} aria-hidden="true" />
                <span className="w-1.5 h-1.5 rounded-full bg-sage-400 animate-bounce"
                      style={{ animationDelay: "300ms" }} aria-hidden="true" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
            {[
              "What products do you have?",
              "Help me sleep better",
              "What's good for kids?",
              "Show my cart",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInput(suggestion);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="text-xs bg-sage-50 border border-sage-200 text-sage-700
                           rounded-full px-3 py-1.5 hover:bg-sage-100
                           transition-colors duration-150"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 pb-3 pt-2 border-t border-natural-200 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-natural-200
                          rounded-xl px-3 py-2 focus-within:border-sage-400
                          transition-colors duration-200">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything…"
              disabled={isLoading}
              aria-label="Message input"
              className="flex-1 text-sm text-earth-800 placeholder:text-earth-400
                         bg-transparent outline-none disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="w-8 h-8 rounded-lg bg-sage-500 flex items-center justify-center
                         hover:bg-sage-600 disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-200 shrink-0"
            >
              {isLoading
                ? <Loader2 size={14} className="text-white animate-spin" aria-hidden="true" />
                : <Send    size={14} className="text-white" aria-hidden="true" />
              }
            </button>
          </div>
          <p className="text-center text-[10px] text-earth-400 mt-1.5">
            RAG-powered AI • {productCount} products loaded from DynamoDB
          </p>
        </div>
      </div>
    </>
  );
}
