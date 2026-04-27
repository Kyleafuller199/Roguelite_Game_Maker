import MapView from "@/components/game/MapView";
import { styles } from "@/components/game/shared/gameStyles";

export default function MapScreen({ mapData, currentNodeId, visitedIds, onNodeClick, onBack }) {
  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button onClick={onBack} style={styles.btn}>← Editor</button>
        <span style={{ color: "#888", fontSize: 13 }}>Choose your path</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MapView
          mapData={mapData}
          currentNodeId={currentNodeId}
          visitedIds={visitedIds}
          onNodeClick={onNodeClick}
        />
      </div>
    </div>
  );
}
