import { defineStorage } from "@aws-amplify/backend";

/**
 * S3 storage for NatureMama Heritage.
 * - product-images/  → public read, admin write
 * - gallery/         → public read, admin write
 * - user-uploads/    → authenticated users can manage their own files
 */
export const storage = defineStorage({
  name: "naturemama-assets",
  access: (allow) => ({
    "product-images/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read"]),
      allow.groups(["admin"]).to(["read", "write", "delete"]),
    ],
    "gallery/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read"]),
      allow.groups(["admin"]).to(["read", "write", "delete"]),
    ],
    "user-uploads/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
  }),
});
