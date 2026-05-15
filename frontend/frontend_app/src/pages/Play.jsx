/**
 * Play.jsx
 *
 * Root of the in-browser game loop. Owns all game state and decides
 * which screen to show.
 *
 * Screen flow:
 *   Editor → "Start Run" → sessionStorage
 *     ├─ Single character  → /play creates session → MapScreen
 *     └─ Multi character   → /play → CharacterSelectScreen → session → MapScreen
 *
 *   MapScreen → node click:
 *     ├─ combat/elite/boss → CombatScreen
 *     │     └─ victory     → CardRewardScreen (if pool has cards) → MapScreen
 *     ├─ rest              → RestScreen → MapScreen
 *     ├─ treasure          → TreasureScreen → MapScreen
 *     └─ event             → EventScreen → MapScreen
 *
 * sessionStorage keys:
 *   runPayload          — resolved run payload for the selected character
 *   characterSelectData — { characters, payloads } when project has >1 character
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { API_BASE, styles, colors, font, radius } from "@/components/game/shared/gameStyles";
import { relicEffectLines }      from "@/components/game/shared/relicUtils";
import MapScreen                 from "@/components/game/screens/MapScreen";
import CombatScreen              from "@/components/game/screens/CombatScreen";
import RestScreen                from "@/components/game/screens/RestScreen";
import TreasureScreen            from "@/components/game/screens/TreasureScreen";
import EventScreen               from "@/components/game/screens/EventScreen";
import CardRewardScreen          from "@/components/game/screens/CardRewardScreen";
import CharacterSelectScreen     from "@/components/game/screens/CharacterSelectScreen";

// Helpers — read sessionStorage safely (values may be absent or malformed)
function getRunPayload()     { try { return JSON.parse(sessionStorage.getItem("runPayload"))      ?? null; } catch { return null; } }
function getCharSelectData() { try { return JSON.parse(sessionStorage.getItem("characterSelectData")) ?? null; } catch { return null; } }

// Single relic badge with a hover tooltip showing effects
function RelicBarItem({ relic }) {
  const [hovered, setHovered] = useState(false);
  const lines = relicEffectLines(relic);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge */}
      <div style={{
        background: "rgba(0,0,0,0.82)",
        border: `1px solid rgba(240,192,48,0.45)`,
        borderRadius: radius.lg, padding: "5px 10px",
        fontSize: font.sizeSM, color: colors.gold, fontWeight: 600,
        maxWidth: 160, cursor: "default", userSelect: "none",
      }}>
        {relic.identity?.name ?? "Relic"}
      </div>

      {/* Tooltip — appears to the right when hovered */}
      {hovered && (
        <div style={{
          position: "absolute", left: "calc(100% + 8px)", top: 0,
          background: "rgba(10,8,6,0.96)",
          border: `1px solid rgba(240,192,48,0.4)`,
          borderRadius: radius.xl, padding: "10px 14px",
          minWidth: 200, maxWidth: 260, zIndex: 200,
          pointerEvents: "none",
        }}>
          <div style={{ fontSize: font.sizeMD, fontWeight: 700, color: colors.gold, marginBottom: 4 }}>
            {relic.identity?.name ?? "Relic"}
          </div>
          <div style={{ fontSize: font.sizeXS, color: colors.textMuted, marginBottom: 6 }}>
            {relic.identity?.rarity ?? ""}
          </div>
          {lines.length > 0
            ? lines.map((line, i) => (
                <div key={i} style={{ fontSize: font.sizeSM, color: colors.textSecondary, lineHeight: 1.5 }}>{line}</div>
              ))
            : <div style={{ fontSize: font.sizeSM, color: colors.textDisabled }}>No effects defined.</div>
          }
        </div>
      )}
    </div>
  );
}

export default function Play() {
  const navigate = useNavigate();

  // ── Game session & map ────────────────────────────────────────────────────
  const [sessionId,     setSessionId]     = useState(null);
  const [mapData,       setMapData]       = useState(null);

  // ── Active combat state ───────────────────────────────────────────────────
  const [gameState,     setGameState]     = useState(null);
  const [monsterInfo,   setMonsterInfo]   = useState(null);
  const [outcome,       setOutcome]       = useState(null);

  // ── Draw / discard piles ──────────────────────────────────────────────────
  const [drawCount,     setDrawCount]     = useState(0);
  const [discardCount,  setDiscardCount]  = useState(0);
  const [drawPile,      setDrawPile]      = useState([]);
  const [discardPile,   setDiscardPile]   = useState([]);

  // ── Map navigation state ──────────────────────────────────────────────────
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [visitedIds,    setVisitedIds]    = useState(new Set());
  const [activeNode,    setActiveNode]    = useState(null);
  const [midCombat,     setMidCombat]     = useState(false);

  // ── Card reward state ─────────────────────────────────────────────────────
  const [rewardCards,   setRewardCards]   = useState([]);

  // ── Non-combat node data (rest HP, etc.) ──────────────────────────────────
  const [nodeData,      setNodeData]      = useState(null);

  // ── Relics collected during this run ──────────────────────────────────────
  const [playerRelics,  setPlayerRelics]  = useState([]);

  // ── Initial screen + character options — read sessionStorage at mount time ─
  // Lazy useState initializers run at component instantiation (first render),
  // NOT at module load time, so they always see the values set by the editor.
  const [characterOptions] = useState(() => getCharSelectData()?.characters ?? []);

  const [screen, setScreen] = useState(() => {
    if (getCharSelectData()) return "characterSelect";
    if (getRunPayload())     return "loading";
    return "error";
  });

  const [error, setError] = useState(() =>
    !getCharSelectData() && !getRunPayload()
      ? "No run payload found — go back to the editor and click Start Run."
      : null
  );

  // ── Session start helper ──────────────────────────────────────────────────
  // Used by handleCharacterSelect (user-triggered, not inside an effect).
  async function startGameSession(payload) {
    try {
      const { session_id } = await fetch(`${API_BASE}/api/game/session/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(r => r.json());

      setSessionId(session_id);

      // Seed the player's relic bar with their starting relic (if any)
      const startingRelicId = payload?.character?.startingRelicId;
      const startingRelic   = startingRelicId ? payload?.relicMap?.[startingRelicId] : null;
      if (startingRelic) setPlayerRelics([startingRelic]);

      const map = await fetch(`${API_BASE}/api/game/map/`).then(r => r.json());
      setMapData(map);
      setScreen("map");
    } catch {
      setError("Failed to connect to the backend. Is it running?");
    }
  }

  // ── On mount: start session for single-character / already-selected flow ──
  // setState is called inside .then() callbacks (not directly in the effect
  // body), which is the pattern the react-hooks/set-state-in-effect rule allows.
  useEffect(() => {
    const payload    = getRunPayload();
    const charSelect = getCharSelectData();

    if (!payload || charSelect) return; // handled by CharacterSelectScreen instead

    fetch(`${API_BASE}/api/game/session/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(r => r.json())
      .then(({ session_id }) => {
        setSessionId(session_id);
        // Seed the relic bar with the starting relic (if the character has one)
        const startingRelicId = payload?.character?.startingRelicId;
        const startingRelic   = startingRelicId ? payload?.relicMap?.[startingRelicId] : null;
        if (startingRelic) setPlayerRelics([startingRelic]);
        return fetch(`${API_BASE}/api/game/map/`);
      })
      .then(r => r.json())
      .then(map => {
        setMapData(map);
        setScreen("map");
      })
      .catch(() => setError("Failed to connect to the backend. Is it running?"));
  }, []);

  // ── Character selected ────────────────────────────────────────────────────
  async function handleCharacterSelect(characterId) {
    const charSelect = getCharSelectData();
    const payload    = charSelect?.payloads?.[characterId] ?? null;
    if (!payload) { setError("Character payload not found."); return; }

    sessionStorage.setItem("runPayload", JSON.stringify(payload));
    sessionStorage.removeItem("characterSelectData");

    setScreen("loading");
    await startGameSession(payload);
  }

  // ── Node click: enter a map node ──────────────────────────────────────────
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

        const { state, monster_info, draw_count, discard_count, draw_pile, discard_pile } = data;
        setGameState(state);
        if (draw_count    !== undefined) setDrawCount(draw_count);
        if (discard_count !== undefined) setDiscardCount(discard_count);
        if (draw_pile)    setDrawPile(draw_pile);
        if (discard_pile) setDiscardPile(discard_pile);
        if (monster_info) setMonsterInfo(monster_info);

        setNodeData(data);

        if (state.game_state === "scene") setScreen("combat");
        else if (node.type === "rest")     setScreen("rest");
        else if (node.type === "treasure") setScreen("treasure");
        else if (node.type === "event")    setScreen("event");
      })
      .catch(() => setError("Failed to enter node."));
  }

  // ── Play a card ───────────────────────────────────────────────────────────
  function handlePlayCard(cardIndex) {
    fetch(`${API_BASE}/api/game/play-card/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, card_index: cardIndex }),
    })
      .then(r => r.json())
      .then(data => {
        setGameState(data.state);
        setDrawCount(data.draw_count ?? 0);
        setDiscardCount(data.discard_count ?? 0);
        if (data.draw_pile)    setDrawPile(data.draw_pile);
        if (data.discard_pile) setDiscardPile(data.discard_pile);
        if (data.outcome) setOutcome(data.outcome);
      })
      .catch(() => setError("Failed to play card."));
  }

  // ── End turn ──────────────────────────────────────────────────────────────
  function handleEndTurn() {
    fetch(`${API_BASE}/api/game/end-turn/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(r => r.json())
      .then(data => {
        setGameState(data.state);
        setDrawCount(data.draw_count ?? 0);
        setDiscardCount(data.discard_count ?? 0);
        if (data.draw_pile)    setDrawPile(data.draw_pile);
        if (data.discard_pile) setDiscardPile(data.discard_pile);
        if (data.outcome) setOutcome(data.outcome);
      })
      .catch(() => setError("Failed to end turn."));
  }

  // ── Victory: route to card reward or straight back to map ─────────────────
  function handleVictory() {
    const payload = getRunPayload();
    const pool    = payload?.cardPool ?? [];
    const cardMap = payload?.cardMap  ?? {};

    if (pool.length > 0) {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const picks    = shuffled
        .slice(0, Math.min(3, shuffled.length))
        .map(id => cardMap[id])
        .filter(Boolean);

      setRewardCards(picks);
      setScreen("cardReward");
    } else {
      returnToMap();
    }
  }

  // ── Card reward: player picks a card ──────────────────────────────────────
  function handleRewardPick(card) {
    fetch(`${API_BASE}/api/game/add-card/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, card_id: card.id }),
    })
      .then(() => returnToMap())
      .catch(() => returnToMap());
  }

  // ── Map navigation helpers ────────────────────────────────────────────────

  function pauseCombat() {
    if (outcome) {
      returnToMap();
    } else {
      setMidCombat(true);
      setScreen("map");
    }
  }

  function returnToMap() {
    setMidCombat(false);
    setScreen("map");
    setOutcome(null);
    setActiveNode(null);
    setGameState(null);
    setMonsterInfo(null);
    setDrawCount(0);
    setDiscardCount(0);
    setDrawPile([]);
    setDiscardPile([]);
    setRewardCards([]);
    setNodeData(null);
  }

  function resumeCombat(node) {
    if (node.id === activeNode?.id) {
      setMidCombat(false);
      setScreen("combat");
    }
  }

  function handleRelicPick(relic) {
    setPlayerRelics(prev => [...prev, relic]);
  }

  // Whether the current character has card rewards available
  const hasCardReward = (getRunPayload()?.cardPool?.length ?? 0) > 0;

  // ── Screen rendering ──────────────────────────────────────────────────────
  // Screens that don't need the relic bar get early returns.
  // All gameplay screens share a single return so the fixed relic bar
  // renders as an overlay on top of every screen without prop-drilling.

  if (error) {
    return (
      <div style={styles.center}>
        <p style={{ color: "#c0392b" }}>{error}</p>
        <button onClick={() => navigate("/editor")} style={styles.btn}>← Back to Editor</button>
      </div>
    );
  }

  if (screen === "loading") {
    return (
      <div style={styles.center}>
        <p style={{ color: "#888" }}>Loading…</p>
      </div>
    );
  }

  if (screen === "characterSelect") {
    return (
      <CharacterSelectScreen
        characterOptions={characterOptions}
        onSelectCharacter={handleCharacterSelect}
      />
    );
  }

  // ── Gameplay screens — rendered with the persistent relic bar ─────────────
  let content = null;

  if (screen === "map") {
    content = (
      <MapScreen
        mapData={mapData}
        currentNodeId={currentNodeId}
        visitedIds={visitedIds}
        onNodeClick={midCombat ? resumeCombat : handleNodeClick}
        onBack={() => navigate("/editor")}
        midCombatNodeId={midCombat ? activeNode?.id : null}
      />
    );
  } else if (screen === "combat") {
    content = (
      <CombatScreen
        gameState={gameState}
        monsterInfo={monsterInfo}
        activeNode={activeNode}
        outcome={outcome}
        drawCount={drawCount}
        discardCount={discardCount}
        drawPile={drawPile}
        discardPile={discardPile}
        onPlayCard={handlePlayCard}
        onEndTurn={handleEndTurn}
        onBack={pauseCombat}
        onVictory={handleVictory}
        hasReward={hasCardReward}
      />
    );
  } else if (screen === "cardReward") {
    content = (
      <CardRewardScreen
        rewardCards={rewardCards}
        onSelectCard={handleRewardPick}
        onSkip={returnToMap}
      />
    );
  } else if (screen === "rest") {
    content = <RestScreen sessionId={sessionId} nodeData={nodeData} onContinue={returnToMap} />;
  } else if (screen === "treasure") {
    content = <TreasureScreen sessionId={sessionId} onRelicPick={handleRelicPick} onContinue={returnToMap} />;
  } else if (screen === "event") {
    content = <EventScreen onContinue={returnToMap} />;
  }

  return (
    <>
      {content}

      {/* Persistent relic bar — fixed top-left, visible on all gameplay screens */}
      {playerRelics.length > 0 && (
        <div style={{
          position: "fixed", top: 52, left: 12, zIndex: 100,
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          {playerRelics.map((relic, i) => (
            <RelicBarItem key={relic.id ?? i} relic={relic} />
          ))}
        </div>
      )}
    </>
  );
}
