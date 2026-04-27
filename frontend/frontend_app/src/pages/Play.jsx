import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "@/components/game/MapView";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

// Maps node type to the scene background image path
const SCENE_BG = {
  battle:   "scenes/battle/battle.png",
  elite:    "scenes/battle/elite.png",
  boss:     "scenes/battle/boss.png",
  rest:     "scenes/rest/rest.png",
  treasure: "scenes/treasure/treasure.png",
};

export default function Play() {
  const navigate = useNavigate();

  const [sessionId,     setSessionId]     = useState(null);
  const [mapData,       setMapData]       = useState(null);
  const [gameState,     setGameState]     = useState(null);
  const [monsterInfo,   setMonsterInfo]   = useState(null);
  const [activeNode,    setActiveNode]    = useState(null);
  const [screen,        setScreen]        = useState("loading");
  const [error,         setError]         = useState(
    () => sessionStorage.getItem("runPayload")
      ? null
      : "No run payload found — go back to the editor and click Start Run."
  );
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [visitedIds,    setVisitedIds]    = useState(new Set());

  // On mount: create a backend session then fetch the map
  useEffect(() => {
    const raw = sessionStorage.getItem("runPayload");
    if (!raw) return; // error already set in initial state

    fetch(`${API_BASE}/api/game/session/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    })
      .then(r => r.json())
      .then(({ session_id }) => {
        setSessionId(session_id);
        return fetch(`${API_BASE}/api/game/map/`);
      })
      .then(r => r.json())
      .then(map => {
        setMapData(map);
        setScreen("map");
      })
      .catch(() => setError("Failed to connect to the backend. Is it running?"));
  }, []);

  function handleNodeClick(node) {
    fetch(`${API_BASE}/api/game/node/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, node }),
    })
      .then(r => r.json())
      .then(data => {
        setCurrentNodeId(node.id);
        setVisitedIds(prev => new Set([...prev, node.id]));
        setActiveNode(node);

        const { state, monster_info } = data;
        setGameState(state);

        if (monster_info) setMonsterInfo(monster_info);

        const type = node.type;
        if (state.game_state === "scene") {
          setScreen("combat");
        } else if (type === "rest") {
          setScreen("rest");
        } else if (type === "treasure") {
          setScreen("treasure");
        }
      })
      .catch(() => setError("Failed to enter node."));
  }

  function returnToMap() {
    setScreen("map");
    setActiveNode(null);
    setGameState(null);
    setMonsterInfo(null);
  }

  // ── Error ─────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div style={styles.center}>
        <p style={{ color: "#c0392b" }}>{error}</p>
        <button onClick={() => navigate("/editor")} style={styles.btn}>← Back to Editor</button>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (screen === "loading") {
    return (
      <div style={styles.center}>
        <p style={{ color: "#888" }}>Loading…</p>
      </div>
    );
  }

  // ── Map ───────────────────────────────────────────────────────────────────

  if (screen === "map") {
    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button onClick={() => navigate("/editor")} style={styles.btn}>← Editor</button>
          <span style={{ color: "#888", fontSize: 13 }}>Choose your path</span>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MapView
            mapData={mapData}
            currentNodeId={currentNodeId}
            visitedIds={visitedIds}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>
    );
  }

  // ── Combat (battle / elite / boss) ────────────────────────────────────────

  if (screen === "combat") {
    const combat  = gameState?.combat;
    const player  = combat?.player;
    const enemy   = combat?.monster;
    const turn    = combat?.combat;

    const sceneBg  = SCENE_BG[activeNode?.type] ?? SCENE_BG.battle;
    const monsterFolder = monsterInfo?.folder ?? "basic";
    const monsterImg    = monsterInfo?.imageUrl ?? "";
    const monsterName   = monsterInfo?.name ?? "Enemy";

    const payload    = JSON.parse(sessionStorage.getItem("runPayload") ?? "{}");
    const charImg    = payload?.character?.imageUrl ?? "";

    return (
      <div style={{ ...styles.page, position: "relative" }}>
        {/* Scene background */}
        <img
          src={`${API_BASE}/api/assets/file/?path=${sceneBg}`}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
        {/* Dark overlay so UI stays readable */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1 }} />

        {/* Top bar */}
        <div style={{ ...styles.topBar, position: "relative", zIndex: 2 }}>
          <button onClick={returnToMap} style={styles.btn}>← Map</button>
          <span style={{ color: "#ccc", fontSize: 13, textTransform: "capitalize" }}>
            {activeNode?.type ?? "Combat"}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#f0c030", fontSize: 13 }}>⚡</span>
            <span style={{ fontWeight: 700 }}>{turn?.energy ?? 0}</span>
            <span style={{ color: "#555" }}>/ 3</span>
          </div>
        </div>

        {/* Battle area */}
        <div style={{
          flex: 1, position: "relative", zIndex: 2,
          display: "flex", alignItems: "flex-end",
          padding: "0 80px 20px",
        }}>
          {/* Player — left */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={styles.statBox}>
              <span style={{ fontWeight: 700 }}>{payload?.character?.name ?? "Hero"}</span>
              <HealthBar current={player?.health ?? 0} max={player?.max_health ?? 100} />
              <span style={{ fontSize: 11, color: "#aaa" }}>
                {player?.health ?? 0} / {player?.max_health ?? 100}
              </span>
              {(turn?.player_block ?? 0) > 0 && (
                <span style={styles.blockBadge}>🛡 {turn.player_block}</span>
              )}
            </div>
            <img
              src={`${API_BASE}/api/assets/file/?path=playable_characters/${charImg}`}
              alt=""
              style={styles.sprite}
              onError={e => { e.target.style.display = "none"; }}
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* Monster — right */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={styles.statBox}>
              <span style={{ fontWeight: 700 }}>{monsterName}</span>
              <HealthBar current={enemy?.health ?? 0} max={enemy?.max_health ?? 100} />
              <span style={{ fontSize: 11, color: "#aaa" }}>
                {enemy?.health ?? 0} / {enemy?.max_health ?? 100}
              </span>
              {(turn?.enemy_block ?? 0) > 0 && (
                <span style={styles.blockBadge}>🛡 {turn.enemy_block}</span>
              )}
            </div>
            <img
              src={`${API_BASE}/api/assets/file/?path=monsters/${monsterFolder}/${monsterImg}`}
              alt=""
              style={styles.sprite}
              onError={e => { e.target.style.display = "none"; }}
            />
          </div>
        </div>

        {/* Hand */}
        <div style={{ ...styles.hand, position: "relative", zIndex: 2 }}>
          <div style={styles.cardRow}>
            {(player?.hand ?? []).map((card, i) => (
              <CombatCard key={i} card={card} energy={turn?.energy ?? 0} />
            ))}
            {(player?.hand ?? []).length === 0 && (
              <span style={{ color: "#555", fontSize: 13, alignSelf: "center" }}>No cards in hand</span>
            )}
          </div>
          <button style={styles.endTurnBtn}>End<br />Turn</button>
        </div>
      </div>
    );
  }

  // ── Rest ──────────────────────────────────────────────────────────────────

  if (screen === "rest") {
    return (
      <div style={{ ...styles.page, position: "relative" }}>
        <img
          src={`${API_BASE}/api/assets/file/?path=${SCENE_BG.rest}`}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1 }} />
        <div style={{ ...styles.center, position: "relative", zIndex: 2 }}>
          <h2 style={{ margin: 0 }}>Rest Site</h2>
          <p style={{ color: "#aaa", fontSize: 14 }}>You take a moment to recover.</p>
          <button onClick={returnToMap} style={styles.continueBtn}>Continue</button>
        </div>
      </div>
    );
  }

  // ── Treasure ──────────────────────────────────────────────────────────────

  if (screen === "treasure") {
    return (
      <div style={{ ...styles.page, position: "relative" }}>
        <img
          src={`${API_BASE}/api/assets/file/?path=${SCENE_BG.treasure}`}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1 }} />
        <div style={{ ...styles.center, position: "relative", zIndex: 2 }}>
          <h2 style={{ margin: 0 }}>Treasure</h2>
          <p style={{ color: "#aaa", fontSize: 14 }}>You found something valuable.</p>
          <button onClick={returnToMap} style={styles.continueBtn}>Continue</button>
        </div>
      </div>
    );
  }

  return null;
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function HealthBar({ current, max }) {
  const pct   = Math.max(0, Math.min(1, current / max));
  const color = pct > 0.5 ? "#3a8a4a" : pct > 0.25 ? "#c07820" : "#8a2020";
  return (
    <div style={{ width: 140, height: 6, borderRadius: 999, background: "rgba(0,0,0,0.5)", overflow: "hidden" }}>
      <div style={{ width: `${pct * 100}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.3s" }} />
    </div>
  );
}

const TYPE_COLOR = { Attack: "#c0392b", Skill: "#27ae60", Power: "#8e44ad", Curse: "#6d3d7a" };

function CombatCard({ card, energy }) {
  const canPlay   = card.cost <= energy;
  const typeColor = TYPE_COLOR[card.type] ?? "#555";
  return (
    <div style={{
      width: 90, flexShrink: 0,
      background: canPlay ? "#1e1c1b" : "#141210",
      border: `1px solid ${canPlay ? typeColor + "88" : "rgba(255,255,255,0.05)"}`,
      borderRadius: 8, padding: "8px 6px",
      display: "flex", flexDirection: "column", gap: 4,
      opacity: canPlay ? 1 : 0.4,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{
          width: 20, height: 20, borderRadius: 999,
          background: "#111", border: "1px solid rgba(255,255,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
        }}>{card.cost}</span>
        <span style={{ fontSize: 9, fontWeight: 700, color: "#e5e5e5" }}>{card.name}</span>
      </div>
      <span style={{ fontSize: 8, color: typeColor, fontWeight: 700, textTransform: "uppercase" }}>{card.type}</span>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  page: {
    height: "100vh", display: "flex", flexDirection: "column",
    background: "#0f0a06", color: "#e5e5e5",
    fontFamily: "Inter, sans-serif", overflow: "hidden",
  },
  topBar: {
    height: 48, display: "flex", alignItems: "center", gap: 12,
    padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
    background: "rgba(0,0,0,0.4)",
  },
  btn: {
    background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 6, color: "#aaa", padding: "4px 12px", cursor: "pointer", fontSize: 12,
  },
  center: {
    height: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    color: "#e5e5e5", fontFamily: "Inter, sans-serif", gap: 12,
  },
  statBox: {
    background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "10px 14px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
  },
  blockBadge: {
    fontSize: 11, color: "#7ec8e3",
    background: "rgba(126,200,227,0.1)", border: "1px solid rgba(126,200,227,0.2)",
    borderRadius: 6, padding: "2px 8px",
  },
  sprite: {
    maxWidth: 180, maxHeight: 220, objectFit: "contain",
  },
  hand: {
    height: 160, background: "rgba(0,0,0,0.7)",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    display: "flex", alignItems: "center", padding: "0 16px", gap: 10, flexShrink: 0,
  },
  cardRow: {
    flex: 1, display: "flex", gap: 8, overflowX: "auto",
    alignItems: "flex-end", paddingBottom: 4,
  },
  endTurnBtn: {
    height: 110, width: 90, flexShrink: 0,
    background: "#226635", border: "none", borderRadius: 10,
    color: "#fff", fontWeight: 700, fontSize: 14,
    cursor: "pointer", textAlign: "center", lineHeight: 1.3,
  },
  continueBtn: {
    padding: "10px 28px", background: "#226635",
    border: "none", borderRadius: 8, color: "#fff",
    fontWeight: 700, fontSize: 14, cursor: "pointer",
  },
};
