import { defineAuth } from "@aws-amplify/backend";

/**
 * Auth configuration for NatureMama Heritage.
 * Supports email/password login with optional social providers.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    givenName:  { required: true,  mutable: true },
    familyName: { required: true,  mutable: true },
  },
  groups: ["admin"],
});
