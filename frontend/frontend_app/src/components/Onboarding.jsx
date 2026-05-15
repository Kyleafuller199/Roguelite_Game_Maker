/**
 * Onboarding.jsx
 *
 * 5-step first-time tutorial modal that appears when a user opens the
 * editor for the first time. Explains assets, projects, and gameplay.
 *
 * Behaviour:
 *   - Auto-shown on first visit using a localStorage flag
 *   - Can be skipped at any step (Skip button always visible)
 *   - Next / Back navigate between steps
 *   - Dismissing sets localStorage so it doesn't appear again
 *   - Reopenable at any time via the ? button in the editor header
 */

import { useState } from "react";

// ── Step content ──────────────────────────────────────────────────────────────
// Each step has a title, icon, and multi-line content string.
// Add or edit steps here to update the onboarding flow.
const STEPS = [
  {
    title: "Welcome to Roguelite Game Maker",
    content:
      "This tool lets you design, configure, and play-test your own roguelite card game — no coding required. " +
      "In just a few steps we'll show you how everything fits together.",
  },
  {
    title: "Step 1 — Create Assets",
    content:
      "Assets are the building blocks of your game. Use the editor to create:\n\n" +
      "• Cards — attacks, skills, and powers with effects like damage, block, and healing\n" +
      "• Enemies — creatures with move sets and AI behavior\n" +
      "• Relics — passive items that trigger effects during combat\n" +
      "• Potions — consumables the player can use during a run\n\n" +
      "Switch between asset types using the sidebar on the left.",
  },
  {
    title: "Step 2 — Build a Project",
    content:
      "A project combines your assets into a complete playable game. Switch to Project mode in the sidebar to:\n\n" +
      "• Create a character with a starting deck and relic\n" +
      "• Assign enemies to Acts 1, 2, and 3 (basics, elites, and bosses)\n" +
      "• Set up potion and card reward pools\n\n" +
      "One project = one complete roguelite run configuration.",
  },
  {
    title: "Step 3 — Play Your Game",
    content:
      "When your project is ready, click Start Run in the project inspector. This launches the in-browser game:\n\n" +
      "• Navigate a procedurally generated map\n" +
      "• Click nodes to enter battles, rest sites, treasure rooms, or events\n" +
      "• In combat, play cards from your hand to damage enemies and gain block\n" +
      "• Health carries over between fights — manage it carefully\n\n" +
      "Defeat the boss to complete your run.",
  },
  {
    title: "You're ready to go!",
    content:
      "The editor is pre-loaded with a full demo project — the Ironclad Run — so you can start playing immediately.\n\n" +
      "To try it:\n" +
      "1. Switch to Project mode in the left sidebar\n" +
      "2. Select \"Demo — Ironclad Run\"\n" +
      "3. Click Start Run in the inspector panel on the right\n\n" +
      "You can always reopen this guide by clicking the ? button in the top bar.",
  },
];

// ── localStorage persistence ──────────────────────────────────────────────────
export const ONBOARDING_KEY = "onboarding_seen";

// ── Component ─────────────────────────────────────────────────────────────────
export default function Onboarding({ onClose }) {
  const [step, setStep] = useState(0); // which step is currently shown

  // Mark as seen and close — called by Skip or Get Started
  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, "true");
    onClose();
  }

  const current = STEPS[step];
  const isLast  = step === STEPS.length - 1;
  const isFirst = step === 0;

  return (
    // Full-screen overlayd
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, sans-serif",
    }}>
      {/* Modal card */}
      <div style={{
        background: "#1a1918",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: "40px 44px",
        width: 540,
        maxWidth: "90vw",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>

        {/* Step progress dots — active step is wider and green */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 8, height: 8,
              borderRadius: 999,
              background: i === step ? "#226635" : "rgba(255,255,255,0.15)",
              transition: "width 0.2s, background 0.2s",
            }} />
          ))}
        </div>

        {/* Icon and title for the current step */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}></div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#e5e5e5" }}>
            {current.title}
          </h2>
        </div>

        {/* Step content (multi-line, uses \n for line breaks) */}
        <p style={{ margin: 0, fontSize: 14, color: "#aaa", lineHeight: 1.7, whiteSpace: "pre-line" }}>
          {current.content}
        </p>

        {/* Navigation buttons: Skip (left) | Back | Next / Get Started */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>

          {/* Skip — always shown, dismisses without completing all steps */}
          <button
            onClick={dismiss}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8, color: "#666",
              padding: "8px 16px", cursor: "pointer", fontSize: 13,
              marginRight: "auto",
            }}
          >
            Skip
          </button>

          {/* Back — hidden on first step */}
          {!isFirst && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8, color: "#aaa",
                padding: "8px 20px", cursor: "pointer", fontSize: 13,
              }}
            >
              ← Back
            </button>
          )}

          {/* Next on all steps except the last; Get Started on the last */}
          <button
            onClick={isLast ? dismiss : () => setStep(s => s + 1)}
            style={{
              background: "#226635",
              border: "none", borderRadius: 8,
              color: "#fff", fontWeight: 700,
              padding: "8px 24px", cursor: "pointer", fontSize: 13,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#2a7a40"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#226635"; }}
          >
            {isLast ? "Get Started →" : "Next →"}
          </button>
        </div>

      </div>
    </div>
  );
}
