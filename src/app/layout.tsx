import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AmplifyProvider } from "@/components/providers/AmplifyProvider";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShoppingAssistant from "@/components/chat/ShoppingAssistant";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NatureMama Heritage – Premium Natural Wellness",
    template: "%s | NatureMama Heritage",
  },
  description:
    "Authentic, traceable wellness supplements crafted from the French Alps. 100% organic, cold-extracted, and certified.",
  keywords: [
    "natural wellness",
    "organic supplements",
    "French Alps",
    "cold extraction",
    "eco-conscious",
    "NatureMama",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://naturemama-heritage.com",
    siteName: "NatureMama Heritage",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AmplifyProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            {/* Floating AI shopping assistant — rendered on every page */}
            <ShoppingAssistant />
            {/* Slide-out cart drawer */}
            <CartDrawer />
          </CartProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
