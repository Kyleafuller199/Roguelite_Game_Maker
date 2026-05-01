/**
 * Play.jsx
 *
 * Root of the in-browser game loop. Owns all game state and decides
 * which screen to show (map, combat, rest, treasure, event).
 *
 * Flow:
 *   Editor → "Start Run" saves payload to sessionStorage → /play loads
 *   → creates a backend game session → fetches the map → shows MapScreen
 *   → player clicks a node → shows the appropriate screen
 *   → combat ends / continue → back to MapScreen
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { API_BASE, styles } from "@/components/game/shared/gameStyles";
import MapScreen      from "@/components/game/screens/MapScreen";
import CombatScreen   from "@/components/game/screens/CombatScreen";
import RestScreen     from "@/components/game/screens/RestScreen";
import TreasureScreen from "@/components/game/screens/TreasureScreen";
import EventScreen    from "@/components/game/screens/EventScreen";

export default function Play() {
  const navigate = useNavigate();

  // ── Game session & map ────────────────────────────────────────────────────
  // sessionId ties every action to a live GameState on the backend
  const [sessionId,     setSessionId]     = useState(null);
  const [mapData,       setMapData]       = useState(null);   // node graph from Kyle's generator

  // ── Active combat state (returned by the backend after each action) ───────
  const [gameState,     setGameState]     = useState(null);   // player hp, hand, monster hp, energy
  const [monsterInfo,   setMonsterInfo]   = useState(null);   // monster name, image, folder
  const [outcome,       setOutcome]       = useState(null);   // "victory" | "defeat" | null

  // ── Draw / discard piles ──────────────────────────────────────────────────
  const [drawCount,     setDrawCount]     = useState(0);
  const [discardCount,  setDiscardCount]  = useState(0);
  const [drawPile,      setDrawPile]      = useState([]);
  const [discardPile,   setDiscardPile]   = useState([]);

  // ── Map navigation state ──────────────────────────────────────────────────
  const [currentNodeId, setCurrentNodeId] = useState(null);  // node the player is on
  const [visitedIds,    setVisitedIds]    = useState(new Set()); // completed nodes
  const [activeNode,    setActiveNode]    = useState(null);   // node currently being played
  const [midCombat,     setMidCombat]     = useState(false);  // true when player pauses mid-fight

  // ── Screen routing ────────────────────────────────────────────────────────
  const [screen,        setScreen]        = useState("loading"); // "loading"|"map"|"combat"|"rest"|"treasure"|"event"
  const [error,         setError]         = useState(
    () => sessionStorage.getItem("runPayload")
      ? null
      : "No run payload found — go back to the editor and click Start Run."
  );

  // ── On mount: create backend session + fetch map ──────────────────────────
  // 1. POST the run payload to /api/game/session/ → get session_id
  // 2. GET /api/game/map/ → get the node graph
  // 3. Show the map screen
  useEffect(() => {
    const raw = sessionStorage.getItem("runPayload");
    if (!raw) return;

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

  // ── Node click: enter a map node ──────────────────────────────────────────
  // Sends the clicked node to the backend. The backend picks an enemy,
  // starts combat via Kyle's GameState, and returns the initial game state.
  // Routes to the correct screen based on node type and returned game_state.
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

        // "scene" = Kyle's term for active combat
        if (state.game_state === "scene") setScreen("combat");
        else if (node.type === "rest")      setScreen("rest");
        else if (node.type === "treasure")  setScreen("treasure");
        else if (node.type === "event")     setScreen("event");
      })
      .catch(() => setError("Failed to enter node."));
  }

  // ── Play a card ───────────────────────────────────────────────────────────
  // Sends the card index to the backend → Kyle's engine applies effects
  // (damage, block, heal) → returns updated state with new hp, hand, energy
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
  // Discards hand, runs the enemy's next move via Kyle's engine,
  // then draws a fresh hand of 5. Returns updated state.
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

  // ── Map navigation helpers ────────────────────────────────────────────────

  // "← Map" mid-fight: preserves combat state, shows locked map with red node
  function pauseCombat() {
    if (outcome) {
      returnToMap(); // fight already over — clear everything
    } else {
      setMidCombat(true);
      setScreen("map");
    }
  }

  // Victory / defeat / non-combat continue: clears all combat state
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
  }

  // Clicking the red mid-combat node resumes the paused fight
  function resumeCombat(node) {
    if (node.id === activeNode?.id) {
      setMidCombat(false);
      setScreen("combat");
    }
  }

  // ── Screen rendering ──────────────────────────────────────────────────────

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

  // Map: mid-combat swaps handler so only the red node is clickable
  if (screen === "map") {
    return (
      <MapScreen
        mapData={mapData}
        currentNodeId={currentNodeId}
        visitedIds={visitedIds}
        onNodeClick={midCombat ? resumeCombat : handleNodeClick}
        onBack={() => navigate("/editor")}
        midCombatNodeId={midCombat ? activeNode?.id : null}
      />
    );
  }

  if (screen === "combat") {
    return (
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
      />
    );
  }

  if (screen === "rest")     return <RestScreen     onContinue={returnToMap} />;
  if (screen === "treasure") return <TreasureScreen onContinue={returnToMap} />;
  if (screen === "event")    return <EventScreen    onContinue={returnToMap} />;

  return null;
}
