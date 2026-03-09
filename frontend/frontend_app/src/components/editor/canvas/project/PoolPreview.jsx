/**
 * PoolPreview.jsx
 * Live preview for a selected pool node in project mode.
 * Reads selectedNode.pool to determine which pool type to render,
 * then displays all assets currently in that pool as a visual grid.
 */

import { useEditor } from "@/state/editor/useEditor";
import { canvasContainer, canvasSectionTitle, COLOR_TEXT_SECONDARY } from "../canvasStyles";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

const CARD_RARITY_COLOR = {
  Common:   "#888888",
  Uncommon: "#4a90e2",
  Rare:     "#f0c030",
  Curse:    "#8b4fa8",
  Starter:  "#888888", // same as Common
};

const RELIC_RARITY_COLOR = {
  Common:   "#888888",
  Uncommon: "#4a90e2",
  Rare:     "#f0c030",
  Boss:     "#a0522d",
  Shop:     "#4a8840",
  Starter:  "#a0522d", // same as Boss
};

const TYPE_COLOR = {
  Attack: "#8b2020",
  Skill:  "#2a7a40",
  Power:  "#a0305a",
  Curse:  "#5a3070",
};

const POOL_TITLES = {
  cards:   "Card Pool",
  relics:  "Relic Pool",
  potions: "Potion Pool",
  enemies: "Enemy Pool",
};

const CHARACTER_POOL_TITLES = {
  cards:  "Card Pool",
  relics: "Relic Pool",
};

// ── Card tile ─────────────────────────────────────────────────────────────────

function CardTile({ card }) {
  const rarity      = card.rarity ?? "Common";
  const type        = card.type   ?? "Attack";
  const cost        = card.cost   ?? 0;
  const rarityColor = CARD_RARITY_COLOR[rarity] ?? "#888";
  const typeColor   = TYPE_COLOR[type]           ?? "#888";
  const imageH      = Math.round(130 * 9 / 16); // ~73px art

  return (
    <div style={{
      width: 130, flexShrink: 0,
      borderRadius: 10,
      backgroundColor: "#141312",
      border: `2px solid ${rarityColor}44`,
      boxShadow: `0 0 10px ${rarityColor}11`,
      overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Title bar */}
      <div style={{ height: 30, display: "flex", alignItems: "center", gap: 5, padding: "0 6px", backgroundColor: "#1e1c1b", flexShrink: 0 }}>
        <span style={{ width: 18, height: 18, borderRadius: 4, backgroundColor: "#111", border: `1px solid ${rarityColor}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
          {cost}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#e5e5e5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {card.name ?? "Unnamed"}
        </span>
      </div>

      {/* Art */}
      <div style={{ height: imageH, backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
        {card.imageUrl ? (
          <img src={`${API_BASE}/api/assets/file/?path=cards/${card.imageUrl}`} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ fontSize: 9, color: "#333", fontStyle: "italic" }}>No image</div>
        )}
      </div>

      {/* Type / rarity tags */}
      <div style={{ height: 18, display: "flex", flexShrink: 0 }}>
        <div style={{ flex: 1, backgroundColor: rarityColor + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: rarityColor, textTransform: "uppercase", letterSpacing: 0.5 }}>{rarity}</div>
        <div style={{ flex: 1, backgroundColor: typeColor + "88", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "#e5e5e5", textTransform: "uppercase", letterSpacing: 0.5 }}>{type}</div>
      </div>
    </div>
  );
}

// ── Generic asset tile (relics, potions, enemies) ─────────────────────────────

function AssetTile({ imageUrl, folder, name, rarity }) {
  const color = RELIC_RARITY_COLOR[rarity] ?? "#888";
  return (
    <div style={{
      width: 110, flexShrink: 0,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    }}>
      <div style={{
        width: 110, height: 110,
        borderRadius: 10,
        backgroundColor: "#141312",
        border: `2px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {imageUrl ? (
          <img src={`${API_BASE}/api/assets/file/?path=${folder}/${imageUrl}`} alt={name} style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }} />
        ) : (
          <div style={{ fontSize: 9, color: "#444", fontStyle: "italic" }}>No image</div>
        )}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#ddd", textAlign: "center", lineHeight: 1.3 }}>{name ?? "Unnamed"}</div>
      {rarity && (
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, padding: "1px 6px", borderRadius: 999, backgroundColor: color + "22", color, border: `1px solid ${color}44` }}>
          {rarity}
        </span>
      )}
    </div>
  );
}

// ── Pool renderers ────────────────────────────────────────────────────────────

function CardPoolGrid({ cards }) {
  if (cards.length === 0) return <EmptyPool label="No cards in pool." />;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
      {cards.map((card) => <CardTile key={card.id} card={card} />)}
    </div>
  );
}

function RelicPoolGrid({ relics }) {
  if (relics.length === 0) return <EmptyPool label="No relics in pool." />;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
      {relics.map((r) => (
        <AssetTile
          key={r.id}
          imageUrl={r.imageUrl}
          folder="relics"
          name={r.identity?.name ?? r.name}
          rarity={r.identity?.rarity ?? r.rarity}
        />
      ))}
    </div>
  );
}

function PotionPoolGrid({ potions }) {
  if (potions.length === 0) return <EmptyPool label="No potions in pool." />;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
      {potions.map((p) => (
        <AssetTile
          key={p.id}
          imageUrl={p.imageUrl}
          folder="potions"
          name={p.identity?.name ?? p.name}
          rarity={p.identity?.rarity ?? p.rarity}
        />
      ))}
    </div>
  );
}

function EnemyPoolGrid({ enemies }) {
  if (enemies.length === 0) return <EmptyPool label="No enemies in pool." />;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
      {enemies.map((e) => (
        <AssetTile
          key={e.id}
          imageUrl={e.imageUrl}
          folder={`monsters/${e.identity?.enemyType ?? e.identity?.type ?? "basic"}`}
          name={e.identity?.name ?? e.name}
          rarity={null}
        />
      ))}
    </div>
  );
}

function EmptyPool({ label }) {
  return <div style={{ fontSize: 13, color: COLOR_TEXT_SECONDARY, fontStyle: "italic" }}>{label}</div>;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PoolPreview() {
  const { state } = useEditor();
  const { selectedNode, projects, characters } = state.project;

  const project = projects.byId[selectedNode.projectId];
  if (!project) return null;

  const poolType = selectedNode.pool;

  // Resolve pool IDs: character pools (cards/relics) vs project pools (potions/enemies)
  let poolIds;
  let title;
  if (selectedNode.kind === "characterPool") {
    const character = characters.byId[selectedNode.characterId];
    if (!character) return null;
    poolIds = poolType === "cards" ? (character.cardPool ?? []) : (character.relicPool ?? []);
    title   = `${character.name} — ${CHARACTER_POOL_TITLES[poolType] ?? "Pool"}`;
  } else {
    poolIds = project.pools[poolType] ?? [];
    title   = POOL_TITLES[poolType] ?? "Pool";
  }

  let grid = null;
  if (poolType === "cards") {
    const cards = poolIds.map((id) => state.assets.cards.byId[id]).filter(Boolean);
    grid = <CardPoolGrid cards={cards} />;
  } else if (poolType === "relics") {
    const relics = poolIds.map((id) => state.assets.relics.byId[id]).filter(Boolean);
    grid = <RelicPoolGrid relics={relics} />;
  } else if (poolType === "potions") {
    const potions = poolIds.map((id) => state.assets.potions.byId[id]).filter(Boolean);
    grid = <PotionPoolGrid potions={potions} />;
  } else if (poolType === "enemies") {
    const enemies = poolIds.map((id) => state.assets.enemies.byId[id]).filter(Boolean);
    grid = <EnemyPoolGrid enemies={enemies} />;
  }

  return (
    <div style={{ ...canvasContainer, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ ...canvasSectionTitle, fontSize: 20, marginBottom: 16, flexShrink: 0 }}>{title}</div>
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {grid}
      </div>
    </div>
  );
}
