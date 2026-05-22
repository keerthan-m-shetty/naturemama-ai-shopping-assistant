import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// ---------------------------------------------------------------------------
// NatureMama Heritage – Amplify Gen 2 Data Schema
// ---------------------------------------------------------------------------

const schema = a.schema({
  // ─── AI CHAT ASSISTANT ────────────────────────────────────────────────────
  /**
   * Custom query backed by an HTTP data source pointing at Amazon Bedrock.
   * All arguments are a.string() — the AppSync JS resolver runtime cannot
   * handle a.json() arguments reliably.
   *
   * Auth: publicApiKey only — identity pool auth does not work with
   * custom HTTP handlers in Amplify Gen 2.
   */
  chat: a
    .query()
    .arguments({
      conversation: a.string().required(),
      cartContext: a.string().required(),
      catalogContext: a.string().required(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: "BedrockDataSource",
        entry: "./chatHandler.js",
      })
    ),

  // ─── PRODUCT ──────────────────────────────────────────────────────────────
  Product: a
    .model({
      name:             a.string().required(),
      slug:             a.string().required(),
      shortDescription: a.string().required(),
      fullDescription:  a.string(),
      productLine: a.enum([
        "VITALITY",
        "SERENITY",
        "IMMUNITY",
        "CHILDRENS",
      ]),
      category:         a.string(),
      tags:             a.string().array(),
      basePrice:        a.float().required(),
      compareAtPrice:   a.float(),
      currency:         a.string().default("EUR"),
      isOrganic:        a.boolean().default(false),
      isColdExtracted:  a.boolean().default(false),
      isTraceable:      a.boolean().default(false),
      certifications:   a.string().array(),
      origin:           a.string(),
      harvestYear:      a.integer(),
      coverImageKey:    a.string(),
      imageKeys:        a.string().array(),
      videoUrl:         a.string(),
      metaTitle:        a.string(),
      metaDescription:  a.string(),
      isActive:         a.boolean().default(true),
      isFeatured:       a.boolean().default(false),
      stockCount:       a.integer().default(0),
      variants:         a.hasMany("ProductVariant", "productId"),
      reviews:          a.hasMany("Review",         "productId"),
      cartItems:        a.hasMany("CartItem",        "productId"),
      orderItems:       a.hasMany("OrderItem",       "productId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.publicApiKey().to(["create", "read", "update", "delete"]),
      allow.groups(["admin"]).to(["create", "read", "update", "delete"]),
    ]),

  // ─── PRODUCT VARIANT ──────────────────────────────────────────────────────
  ProductVariant: a
    .model({
      productId:   a.id().required(),
      product:     a.belongsTo("Product", "productId"),
      name:        a.string().required(),
      sku:         a.string().required(),
      price:       a.float().required(),
      stockCount:  a.integer().default(0),
      isDefault:   a.boolean().default(false),
      weightGrams: a.float(),
      cartItems:   a.hasMany("CartItem",  "variantId"),
      orderItems:  a.hasMany("OrderItem", "variantId"),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.groups(["admin"]).to(["create", "read", "update", "delete"]),
    ]),

  // ─── REVIEW ───────────────────────────────────────────────────────────────
  Review: a
    .model({
      productId:   a.id().required(),
      product:     a.belongsTo("Product", "productId"),
      rating:      a.integer().required(),
      title:       a.string(),
      body:        a.string(),
      authorName:  a.string(),
      isVerified:  a.boolean().default(false),
      isApproved:  a.boolean().default(false),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.owner().to(["create", "read", "update", "delete"]),
      allow.groups(["admin"]).to(["create", "read", "update", "delete"]),
    ]),

  // ─── CART ─────────────────────────────────────────────────────────────────
  Cart: a
    .model({
      status: a.enum(["ACTIVE", "MERGED", "CONVERTED"]),
      items:  a.hasMany("CartItem", "cartId"),
    })
    .authorization((allow) => [
      allow.owner().to(["create", "read", "update", "delete"]),
    ]),

  // ─── CART ITEM ────────────────────────────────────────────────────────────
  CartItem: a
    .model({
      cartId:    a.id().required(),
      cart:      a.belongsTo("Cart", "cartId"),
      productId: a.id().required(),
      product:   a.belongsTo("Product", "productId"),
      variantId: a.id(),
      variant:   a.belongsTo("ProductVariant", "variantId"),
      quantity:  a.integer().required(),
      unitPrice: a.float().required(),
    })
    .authorization((allow) => [
      allow.owner().to(["create", "read", "update", "delete"]),
    ]),

  // ─── ORDER ────────────────────────────────────────────────────────────────
  Order: a
    .model({
      status: a.enum([
        "PENDING",
        "PAYMENT_PROCESSING",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
      ]),
      totalAmount:     a.float().required(),
      currency:        a.string().default("EUR"),
      shippingAddress: a.json(),
      billingAddress:  a.json(),
      stripePaymentId: a.string(),
      trackingNumber:  a.string(),
      notes:           a.string(),
      items:           a.hasMany("OrderItem", "orderId"),
    })
    .authorization((allow) => [
      allow.owner().to(["create", "read"]),
      allow.groups(["admin"]).to(["create", "read", "update", "delete"]),
    ]),

  // ─── ORDER ITEM ───────────────────────────────────────────────────────────
  OrderItem: a
    .model({
      orderId:     a.id().required(),
      order:       a.belongsTo("Order", "orderId"),
      productId:   a.id().required(),
      product:     a.belongsTo("Product", "productId"),
      variantId:   a.id(),
      variant:     a.belongsTo("ProductVariant", "variantId"),
      productName: a.string().required(),
      variantName: a.string(),
      quantity:    a.integer().required(),
      unitPrice:   a.float().required(),
      totalPrice:  a.float().required(),
    })
    .authorization((allow) => [
      allow.owner().to(["create", "read"]),
      allow.groups(["admin"]).to(["create", "read", "update", "delete"]),
    ]),

  // ─── NEWSLETTER SUBSCRIBER ────────────────────────────────────────────────
  NewsletterSubscriber: a
    .model({
      email:       a.string().required(),
      firstName:   a.string(),
      isConfirmed: a.boolean().default(false),
      source:      a.string(),
    })
    .authorization((allow) => [
      allow.guest().to(["create"]),
      allow.groups(["admin"]).to(["create", "read", "update", "delete"]),
    ]),

  // ─── QUIZ RESULT ──────────────────────────────────────────────────────────
  QuizResult: a
    .model({
      answers: a.json().required(),
      recommendedLine: a.enum([
        "VITALITY",
        "SERENITY",
        "IMMUNITY",
        "CHILDRENS",
      ]),
      email:     a.string(),
      sessionId: a.string(),
    })
    .authorization((allow) => [
      allow.guest().to(["create"]),
      allow.owner().to(["create", "read"]),
      allow.groups(["admin"]).to(["read", "update", "delete"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
