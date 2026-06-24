/**
 * Phone Number Formatter - Converts any phone format to Senegal format
 * Examples:
 *   "773629075" → "+221773629075"
 *   "77 36 29 075" → "+221773629075"
 *   "+221773629075" → "+221773629075"
 *   "221773629075" → "+221773629075"
 */

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  console.log("🔵 [PHONE] Original input:", phone);
  console.log("🔵 [PHONE] Extracted digits:", digits);

  // If already has Senegal country code (221)
  if (digits.startsWith("221")) {
    const formatted = `+${digits}`;
    console.log("✅ [PHONE] Already has country code:", formatted);
    return formatted;
  }

  // If local number without country code
  if (digits.length === 9) {
    const formatted = `+221${digits}`;
    console.log("✅ [PHONE] Converted local to international:", formatted);
    return formatted;
  }

  // If has country code but missing +
  if (digits.length === 12) {
    const formatted = `+${digits}`;
    console.log("✅ [PHONE] Added + to country code:", formatted);
    return formatted;
  }

  console.warn("⚠️ [PHONE] Unexpected phone length:", digits.length, "- Using as-is with +");
  return `+${digits}`;
}

/**
 * Validate Senegal phone number
 * Returns true if number is valid Senegal format
 */
export function isValidSenegalPhone(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  const isValid = /^\+221\d{9}$/.test(formatted);
  
  if (isValid) {
    console.log("✅ [PHONE] Valid Senegal phone:", formatted);
  } else {
    console.error("❌ [PHONE] Invalid Senegal phone:", formatted, "- Must be +221XXXXXXXXX (9 digits)");
  }

  return isValid;
}

/**
 * Get the display version of phone number
 * "+221773629075" → "+221 77 36 29 075"
 */
export function getDisplayPhoneNumber(phone: string): string {
  const formatted = formatPhoneNumber(phone);
  const match = formatted.match(/^(\+\d{3})(\d{2})(\d{2})(\d{2})(\d{3})$/);
  
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  }

  return formatted;
}
