"use client";

import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>({ authMode: "apiKey" });

const PRODUCTS_TO_SEED = [
  {
    name: "Vitality Complex",
    slug: "vitality-complex",
    shortDescription: "Daily energy & resilience from wild alpine botanicals",
    fullDescription:
      "A powerful blend of adaptogenic herbs and cold-extracted plant compounds designed to support sustained energy, mental clarity, and physical resilience. Sourced from certified organic farms in the French Alps.",
    productLine: "VITALITY" as const,
    category: "Supplements",
    tags: ["organic", "cold-extracted", "adaptogenic", "energy"],
    basePrice: 42.0,
    compareAtPrice: 49.0,
    currency: "EUR",
    isOrganic: true,
    isColdExtracted: true,
    isTraceable: true,
    certifications: ["Ecocert", "AB", "ISO22000"],
    origin: "French Alps",
    isActive: true,
    isFeatured: true,
    stockCount: 150,
  },
  {
    name: "Serenity Blend",
    slug: "serenity-blend",
    shortDescription: "Deep calm & restful sleep from alpine lavender and valerian",
    fullDescription:
      "A gentle yet effective formula combining organic lavender, valerian root, and passionflower — all cold-extracted to preserve their calming bioactive compounds. Helps promote deep, restorative sleep without morning grogginess.",
    productLine: "SERENITY" as const,
    category: "Supplements",
    tags: ["organic", "sleep", "calming", "traceable"],
    basePrice: 38.0,
    compareAtPrice: 45.0,
    currency: "EUR",
    isOrganic: true,
    isColdExtracted: false,
    isTraceable: true,
    certifications: ["Ecocert", "AB"],
    origin: "French Alps",
    isActive: true,
    isFeatured: true,
    stockCount: 200,
  },
  {
    name: "Immunity Shield",
    slug: "immunity-shield",
    shortDescription: "Year-round natural defence with elderberry and echinacea",
    fullDescription:
      "A potent immune-support formula featuring cold-extracted elderberry, echinacea, and propolis from alpine beehives. Third-party lab tested for purity and potency. Designed for daily use during cold season or travel.",
    productLine: "IMMUNITY" as const,
    category: "Supplements",
    tags: ["certified", "cold-extracted", "immune-support", "elderberry"],
    basePrice: 45.0,
    compareAtPrice: 52.0,
    currency: "EUR",
    isOrganic: true,
    isColdExtracted: true,
    isTraceable: true,
    certifications: ["Ecocert", "AB", "ISO22000"],
    origin: "French Alps",
    isActive: true,
    isFeatured: true,
    stockCount: 120,
  },
  {
    name: "Children's Daily",
    slug: "childrens-daily",
    shortDescription: "Gentle daily support for little ones, no artificial additives",
    fullDescription:
      "A specially formulated children's supplement with organic fruit extracts, vitamin D3, and gentle probiotics. Zero synthetic additives, zero artificial flavours. Designed for ages 3-12 with a taste kids actually enjoy.",
    productLine: "CHILDRENS" as const,
    category: "Children",
    tags: ["organic", "no-additives", "children", "gentle"],
    basePrice: 34.0,
    compareAtPrice: 40.0,
    currency: "EUR",
    isOrganic: true,
    isColdExtracted: false,
    isTraceable: true,
    certifications: ["Ecocert", "AB"],
    origin: "French Alps",
    isActive: true,
    isFeatured: true,
    stockCount: 180,
  },
  {
    name: "Omega Alpine",
    slug: "omega-alpine",
    shortDescription: "Plant-based omega-3 from alpine flaxseed and chia",
    fullDescription:
      "A 100% plant-based omega-3 supplement derived from cold-pressed alpine flaxseed and chia seed oils. Rich in ALA, EPA, and DHA precursors. Sustainable, vegan, and free from heavy metals.",
    productLine: "VITALITY" as const,
    category: "Oils",
    tags: ["organic", "vegan", "omega-3", "cold-pressed"],
    basePrice: 36.0,
    currency: "EUR",
    isOrganic: true,
    isColdExtracted: true,
    isTraceable: true,
    certifications: ["Ecocert", "Vegan Society"],
    origin: "French Alps",
    isActive: true,
    isFeatured: false,
    stockCount: 90,
  },
  {
    name: "Digestive Harmony",
    slug: "digestive-harmony",
    shortDescription: "Prebiotic and probiotic blend for gut wellness",
    fullDescription:
      "A synbiotic formula combining 8 probiotic strains with organic prebiotic fibres from chicory root and acacia. Supports healthy digestion, nutrient absorption, and immune function through the gut-brain axis.",
    productLine: "SERENITY" as const,
    category: "Supplements",
    tags: ["organic", "probiotics", "gut-health", "prebiotic"],
    basePrice: 39.0,
    currency: "EUR",
    isOrganic: true,
    isColdExtracted: false,
    isTraceable: true,
    certifications: ["Ecocert", "AB"],
    origin: "French Alps",
    isActive: true,
    isFeatured: false,
    stockCount: 110,
  },
  {
    name: "Omega Junior",
    slug: "omega-junior",
    shortDescription: "Kid-friendly omega-3 drops with natural berry flavour",
    fullDescription:
      "Liquid omega-3 drops designed for children aged 1-12. Cold-extracted from sustainable algae oil with a natural wild berry flavour. Supports brain development, focus, and healthy growth.",
    productLine: "CHILDRENS" as const,
    category: "Children",
    tags: ["organic", "children", "omega-3", "liquid"],
    basePrice: 28.0,
    currency: "EUR",
    isOrganic: true,
    isColdExtracted: true,
    isTraceable: true,
    certifications: ["Ecocert", "AB"],
    origin: "French Alps",
    isActive: true,
    isFeatured: false,
    stockCount: 140,
  },
  {
    name: "Alpine Collagen",
    slug: "alpine-collagen",
    shortDescription: "Marine collagen peptides for skin, hair, and joints",
    fullDescription:
      "Hydrolyzed marine collagen peptides sourced from sustainable wild-caught fish in Nordic waters. Enhanced with vitamin C from organic acerola cherry for optimal absorption. Supports skin elasticity, hair strength, and joint mobility.",
    productLine: "VITALITY" as const,
    category: "Supplements",
    tags: ["collagen", "marine", "skin", "joints"],
    basePrice: 48.0,
    compareAtPrice: 55.0,
    currency: "EUR",
    isOrganic: false,
    isColdExtracted: false,
    isTraceable: true,
    certifications: ["MSC Certified", "ISO22000"],
    origin: "Nordic Waters / French Alps",
    isActive: true,
    isFeatured: false,
    stockCount: 75,
  },
];

type SeedStatus = "idle" | "seeding" | "done" | "error";

export default function SeedDatabase() {
  const [status, setStatus] = useState<SeedStatus>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  const seedDatabase = async () => {
    setStatus("seeding");
    setLogs([]);
    setProgress(0);
    addLog("🚀 Starting database seed...");
    addLog(`📦 ${PRODUCTS_TO_SEED.length} products to upload`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < PRODUCTS_TO_SEED.length; i++) {
      const product = PRODUCTS_TO_SEED[i];
      try {
        const { data, errors } = await client.models.Product.create(product);
        if (errors) {
          addLog(`❌ Failed: ${product.name} — ${JSON.stringify(errors)}`);
          errorCount++;
        } else {
          addLog(`✅ Uploaded: ${data?.name} (id: ${data?.id})`);
          successCount++;
        }
      } catch (err) {
        addLog(`❌ Exception on ${product.name}: ${String(err)}`);
        errorCount++;
      }
      setProgress(Math.round(((i + 1) / PRODUCTS_TO_SEED.length) * 100));
    }

    addLog("─".repeat(40));
    addLog(`✨ Done! ${successCount} succeeded, ${errorCount} failed.`);
    setStatus(errorCount > 0 ? "error" : "done");
  };

  return (
    <div className="fixed top-20 left-4 z-[100] max-w-md bg-white border border-sage-200 rounded-2xl shadow-2xl p-6">
      <h3 className="font-serif text-lg text-earth-900 mb-2">
        🌱 Database Seed Tool
      </h3>
      <p className="text-sm text-earth-500 mb-4">
        Uploads {PRODUCTS_TO_SEED.length} products to DynamoDB. Run once only.
      </p>

      <button
        onClick={seedDatabase}
        disabled={status === "seeding"}
        className="w-full bg-sage-500 hover:bg-sage-600 disabled:bg-sage-300
                   text-white font-medium py-3 px-4 rounded-xl
                   transition-all duration-200 mb-4"
      >
        {status === "idle" && "🚀 Upload Products to AWS"}
        {status === "seeding" && `⏳ Uploading... ${progress}%`}
        {status === "done" && "✅ All Done!"}
        {status === "error" && "⚠️ Completed with errors"}
      </button>

      {/* Progress bar */}
      {status === "seeding" && (
        <div className="w-full h-2 bg-natural-200 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-sage-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <div className="bg-earth-900 text-sage-200 rounded-xl p-3 max-h-60 overflow-y-auto font-mono text-xs">
          {logs.map((log, i) => (
            <div key={i} className="py-0.5">{log}</div>
          ))}
        </div>
      )}
    </div>
  );
}
