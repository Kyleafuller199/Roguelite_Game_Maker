import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { API_BASE, styles } from "@/components/game/shared/gameStyles";
import MapScreen     from "@/components/game/screens/MapScreen";
import CombatScreen  from "@/components/game/screens/CombatScreen";
import RestScreen    from "@/components/game/screens/RestScreen";
import TreasureScreen from "@/components/game/screens/TreasureScreen";
import EventScreen   from "@/components/game/screens/EventScreen";

export default function Play() {
  const navigate = useNavigate();

  const [sessionId,     setSessionId]     = useState(null);
  const [mapData,       setMapData]       = useState(null);
  const [gameState,     setGameState]     = useState(null);
  const [monsterInfo,   setMonsterInfo]   = useState(null);
  const [activeNode,    setActiveNode]    = useState(null);
  const [outcome,       setOutcome]       = useState(null);
  const [midCombat,     setMidCombat]     = useState(false);
  const [drawCount,     setDrawCount]     = useState(0);
  const [discardCount,  setDiscardCount]  = useState(0);
  const [drawPile,      setDrawPile]      = useState([]);
  const [discardPile,   setDiscardPile]   = useState([]);
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

        if (state.game_state === "scene") {
          setScreen("combat");
        } else if (node.type === "rest")     setScreen("rest");
        else if (node.type === "treasure")   setScreen("treasure");
        else if (node.type === "event")      setScreen("event");
      })
      .catch(() => setError("Failed to enter node."));
  }

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

  // Called by "← Map" during active combat — preserves game state so the
  // player can return to the same fight by clicking the red node on the map.
  function pauseCombat() {
    setMidCombat(true);
    setScreen("map");
  }

  // Called on victory, defeat, or leaving a non-combat node — clears everything.
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

  // Called when the player clicks the red mid-combat node to resume the fight.
  function resumeCombat(node) {
    if (node.id === activeNode?.id) {
      setMidCombat(false);
      setScreen("combat");
    }
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

  // ── Routing ───────────────────────────────────────────────────────────────

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
