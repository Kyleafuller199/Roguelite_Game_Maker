/**
 * clampNumber.js
 *
 * Utility to clamp numeric input into a valid range.
 *
 * Responsibilities:
 * - Converts input (often a string from <input type="number" />) into a number
 * - Handles invalid numeric input safely
 * - Clamps the value to [min, max]
 *
 * @param {string|number} value - Raw input value
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} A valid number within [min, max]
 */
export default function clampNumber(value, min, max) {
  // Convert string input -> number (e.g., from <input type="number" />).
  const n = Number(value);

  // If input isn't numeric, fall back to the minimum valid value.
  if (Number.isNaN(n)) return min;

  // Clamp into [min, max].
  return Math.max(min, Math.min(max, n));
}