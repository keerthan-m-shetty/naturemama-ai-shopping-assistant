import Link from "next/link";
import { Instagram, Youtube, Facebook } from "lucide-react";

const LINKS = {
  Shop: [
    { label: "All Products",    href: "/products" },
    { label: "Vitality",        href: "/products?line=vitality" },
    { label: "Serenity",        href: "/products?line=serenity" },
    { label: "Immunity",        href: "/products?line=immunity" },
    { label: "Children's",      href: "/products?line=childrens" },
    { label: "Wellness Quiz",   href: "/products#quiz" },
  ],
  Company: [
    { label: "Our Story",       href: "/history" },
    { label: "Commitments",     href: "/history#commitments" },
    { label: "Producers",       href: "/history#gallery" },
    { label: "Find a Pharmacy", href: "/history#map" },
    { label: "Press",           href: "/press" },
  ],
  Support: [
    { label: "FAQ",             href: "/faq" },
    { label: "Shipping",        href: "/shipping" },
    { label: "Returns",         href: "/returns" },
    { label: "Contact",         href: "/contact" },
    { label: "My Account",      href: "/account" },
  ],
};

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/naturemama_heritage" },
  { icon: Youtube,   label: "YouTube",   href: "https://youtube.com/@naturemama" },
  { icon: Facebook,  label: "Facebook",  href: "https://facebook.com/naturemama" },
];

export default function Footer() {
  return (
    <footer className="bg-earth-900 text-natural-200" aria-label="Site footer">
      <div className="section-container py-16">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold">
                <span className="text-sage-400">Nature</span>
                <span className="text-white">Mama</span>
              </span>
              <span className="block text-xs text-natural-400 tracking-[0.2em] uppercase mt-0.5">
                Heritage
              </span>
            </Link>
            <p className="text-natural-400 text-sm leading-relaxed max-w-xs mb-6">
              Premium natural wellness supplements, wild-harvested from the French Alps.
              Traceable, organic, and crafted with purpose since 2023.
            </p>
            {/* Certifications */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["Ecocert", "AB Organic", "ISO 22000", "1% Biodiversity"].map((c) => (
                <span
                  key={c}
                  className="text-[10px] font-medium text-natural-400
                             border border-natural-600 rounded-full px-2.5 py-1"
                >
                  {c}
                </span>
              ))}
            </div>
            {/* Socials */}
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-natural-700
                             flex items-center justify-center text-natural-400
                             hover:border-sage-500 hover:text-sage-400
                             transition-all duration-200"
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-white font-semibold text-sm mb-4 tracking-wide">
                {heading}
              </h3>
              <ul className="space-y-2.5" role="list">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-natural-400 text-sm hover:text-sage-400
                                 transition-colors duration-150"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-natural-800 flex flex-col sm:flex-row
                        items-center justify-between gap-4 text-xs text-natural-500">
          <p>© {new Date().getFullYear()} NatureMama Heritage. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-natural-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-natural-300 transition-colors">Terms of Use</Link>
            <Link href="/cookies" className="hover:text-natural-300 transition-colors">Cookie Settings</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
