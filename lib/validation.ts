/*
 * Lightweight form validation. Each validator returns an error key from
 * `t.checkout.errors` (or undefined when valid), so messages stay translated.
 */

export type ErrorKey = "required" | "email" | "postalCode" | "cardNumber" | "expiry" | "cvc";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Postal code formats for the countries we ship to. */
const POSTAL_CODES: Record<string, RegExp> = {
  DE: /^\d{5}$/,
  AT: /^\d{4}$/,
  CH: /^\d{4}$/,
  NL: /^\d{4}\s?[A-Za-z]{2}$/,
  FR: /^\d{5}$/,
};

export const required = (value: string): ErrorKey | undefined => (value.trim() ? undefined : "required");

export function email(value: string): ErrorKey | undefined {
  if (!value.trim()) return "required";
  return EMAIL.test(value.trim()) ? undefined : "email";
}

export function postalCode(value: string, country: string): ErrorKey | undefined {
  if (!value.trim()) return "required";
  const pattern = POSTAL_CODES[country];
  return !pattern || pattern.test(value.trim()) ? undefined : "postalCode";
}

/** Luhn checksum, so obviously mistyped numbers are caught client-side. */
export function cardNumber(value: string): ErrorKey | undefined {
  const digits = value.replace(/\s/g, "");
  if (!digits) return "required";
  if (!/^\d{13,19}$/.test(digits)) return "cardNumber";
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0 ? undefined : "cardNumber";
}

export function expiry(value: string, now = new Date()): ErrorKey | undefined {
  if (!value.trim()) return "required";
  const match = /^(\d{2})\s?\/\s?(\d{2})$/.exec(value.trim());
  if (!match) return "expiry";
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return "expiry";
  // Cards are valid through the last day of the expiry month.
  const endOfMonth = new Date(year, month, 1);
  return endOfMonth > now ? undefined : "expiry";
}

export function cvc(value: string): ErrorKey | undefined {
  if (!value.trim()) return "required";
  return /^\d{3,4}$/.test(value.trim()) ? undefined : "cvc";
}

/** Formats raw input as groups of four digits: "4242 4242 4242 4242". */
export function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** Formats raw input as MM/YY while typing. */
export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}
