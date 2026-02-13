/**
 * clampNumber.js
 * Utility to safely clamp user numeric input into a valid range.
 */
export default function clampNumber(value, min, max) {
    // Convert string input -> number (e.g. from <input type="number" />)
    const n = Number(value);
  
    // If input isn't a number, fall back to the minimum valid value
    if (Number.isNaN(n)) return min;
  
    // Clamp into [min, max]
    return Math.max(min, Math.min(max, n));
  }