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
  const [drawCount,     setDrawCount]     = useState(0);
  const [discardCount,  setDiscardCount]  = useState(0);
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

        const { state, monster_info, draw_count, discard_count } = data;
        setGameState(state);
        if (draw_count    !== undefined) setDrawCount(draw_count);
        if (discard_count !== undefined) setDiscardCount(discard_count);
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
        if (data.outcome) setOutcome(data.outcome);
      })
      .catch(() => setError("Failed to end turn."));
  }

  function returnToMap() {
    setScreen("map");
    setOutcome(null);
    setActiveNode(null);
    setGameState(null);
    setMonsterInfo(null);
    setDrawCount(0);
    setDiscardCount(0);
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
        onNodeClick={handleNodeClick}
        onBack={() => navigate("/editor")}
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
        onPlayCard={handlePlayCard}
        onEndTurn={handleEndTurn}
        onBack={returnToMap}
      />
    );
  }

  if (screen === "rest")     return <RestScreen     onContinue={returnToMap} />;
  if (screen === "treasure") return <TreasureScreen onContinue={returnToMap} />;
  if (screen === "event")    return <EventScreen    onContinue={returnToMap} />;

  return null;
}
