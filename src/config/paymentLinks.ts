
// filename: /src/config/paymentLinks.ts

/**
 * Maps course IDs to their corresponding Stripe payment URLs
 * Used by the Course Description page to get payment links
 */
export const paymentLinksMap: Record<string, string> = {
  // Change Management Professional
  "cmp": "https://buy.stripe.com/cN24gT15K07Y8dG4gg",
  
  // Risk Management Professional
  "rmp": "https://buy.stripe.com/bIY3cP9Cg4oefG8eUW",
  
  // Lean Six Sigma Certification Program - Yellow Belt
  "lsscp-yb": "https://buy.stripe.com/28obJl4hW1c265y5kn",
  
  // Lean Six Sigma Certification Program - Green Belt
  "lsscp-gb": "https://buy.stripe.com/28ofZBcOsaMC9hKbIM",
  
  // Lean Six Sigma Certification Program - Black Belt
  "lsscp-bb": "https://buy.stripe.com/5kAdRt7u807Y65y6ot"
};
