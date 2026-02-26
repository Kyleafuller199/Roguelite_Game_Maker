/**
 * EnemyPoolInspector.jsx
 *
 * Enemy assignment organized by act and role.
 * Each act (1–3) has Basics, Elites, and Bosses sub-sections.
 * Enemies only appear in the section matching their type (basic/elite/boss).
 *
 * @param {object} project - The active project object
 * @param {object} state   - Full editor state (for global asset lists)
 * @param {object} actions - Editor actions
 */

import InspectorSection from "@/components/editor/inspector/shared/InspectorSection";
import PoolRow from "@/components/editor/inspector/project/PoolRow";
import { COLOR_TEXT_SECONDARY } from "@/components/editor/shared/sidebarStyles";

const ACTS = [1, 2, 3];

// role.key matches the acts data key; role.type matches enemy identity.type
const ROLES = [
  { key: "basics", type: "basic",  label: "Basics" },
  { key: "elites", type: "elite",  label: "Elites" },
  { key: "bosses", type: "boss",   label: "Bosses" },
];

const roleLabelStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: COLOR_TEXT_SECONDARY,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  padding: "8px 12px 2px",
};

const emptyRoleStyle = {
  padding: "4px 12px 8px",
  fontSize: 12,
  color: COLOR_TEXT_SECONDARY,
  fontStyle: "italic",
};

function getEnemyType(enemy) {
  // Handle both the old enemyType field and the current type field
  return enemy.identity?.type ?? enemy.identity?.enemyType ?? "basic";
}

export default function EnemyPoolInspector({ project, state, actions }) {
  const allEnemies = state.assets.enemies.allIds
    .map((id) => state.assets.enemies.byId[id])
    .filter(Boolean);

  const acts = project.acts ?? {};

  return (
    <div>
      {ACTS.map((act, i) => {
        const actData = acts[act] ?? { basics: [], elites: [], bosses: [] };

        return (
          <InspectorSection key={act} title={`Act ${act}`} defaultOpen={i === 0}>
            {ROLES.map(({ key, type, label }) => {
              const roleIds = new Set(actData[key] ?? []);
              const roleEnemies = allEnemies.filter((e) => getEnemyType(e) === type);

              return (
                <div key={key}>
                  <div style={roleLabelStyle}>{label}</div>
                  {roleEnemies.length === 0 ? (
                    <div style={emptyRoleStyle}>No {label.toLowerCase()} created yet.</div>
                  ) : (
                    roleEnemies.map((enemy) => (
                      <PoolRow
                        key={enemy.id}
                        label={enemy.identity?.name ?? enemy.name ?? "Unnamed Enemy"}
                        inPool={roleIds.has(enemy.id)}
                        onToggle={() => actions.toggleActEnemy(project.id, act, key, enemy.id)}
                      />
                    ))
                  )}
                </div>
              );
            })}
          </InspectorSection>
        );
      })}
    </div>
  );
}
