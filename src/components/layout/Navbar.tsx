"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Products",    href: "/products" },
  { label: "Our Story",   href: "/history" },
  { label: "Commitments", href: "/history#commitments" },
  { label: "Find Us",     href: "/history#map" },
];

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();
  const [isScrolled,  setIsScrolled]  = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-natural-200"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav
        className="section-container flex items-center justify-between h-16 md:h-20"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tight
                     transition-colors duration-200"
          style={{ color: isScrolled ? undefined : "white" }}
        >
          <span className={isScrolled ? "text-sage-600" : "text-sage-300"}>Nature</span>
          <span className={isScrolled ? "text-earth-800" : "text-white"}>Mama</span>
          <span className={`text-xs font-sans font-normal ml-1.5 tracking-widest uppercase
                            ${isScrolled ? "text-earth-400" : "text-white/60"}`}>
            Heritage
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={[
                  "text-sm font-medium transition-colors duration-200",
                  "hover:text-sage-500",
                  isScrolled ? "text-earth-700" : "text-white/90",
                ].join(" ")}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Account */}
          <Link
            href="/account"
            aria-label="My account"
            className={[
              "hidden md:flex w-9 h-9 items-center justify-center rounded-full",
              "transition-all duration-200 hover:bg-sage-50",
              isScrolled ? "text-earth-700" : "text-white/90",
            ].join(" ")}
          >
            <User size={20} aria-hidden="true" />
          </Link>

          {/* Cart */}
          <button
            onClick={toggleCart}
            aria-label={`Shopping cart, ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
            className={[
              "relative flex w-9 h-9 items-center justify-center rounded-full",
              "transition-all duration-200 hover:bg-sage-50",
              isScrolled ? "text-earth-700" : "text-white/90",
            ].join(" ")}
          >
            <ShoppingBag size={20} aria-hidden="true" />
            {itemCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5
                           w-4 h-4 rounded-full bg-sage-500 text-white
                           text-[10px] font-bold flex items-center justify-center"
                aria-hidden="true"
              >
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
            className={[
              "md:hidden flex w-9 h-9 items-center justify-center rounded-full",
              "transition-all duration-200",
              isScrolled ? "text-earth-700" : "text-white/90",
            ].join(" ")}
          >
            {isMobileOpen
              ? <X    size={22} aria-hidden="true" />
              : <Menu size={22} aria-hidden="true" />
            }
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={[
          "md:hidden overflow-hidden transition-all duration-300",
          isMobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
          "bg-white border-b border-natural-200",
        ].join(" ")}
        aria-hidden={!isMobileOpen}
      >
        <ul className="section-container py-4 flex flex-col gap-1" role="list">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-earth-700 font-medium
                           hover:bg-sage-50 hover:text-sage-600
                           transition-colors duration-150"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-2 border-t border-natural-200 mt-1">
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-earth-700 font-medium
                         hover:bg-sage-50 hover:text-sage-600
                         transition-colors duration-150"
            >
              My Account
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
