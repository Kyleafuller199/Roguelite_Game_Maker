/**
 * EnemyInspector.jsx
 * Composes enemy inspector sections (mirrors enemy JSON structure).
 */
import EnemyIdentity from "./sections/EnemyIdentity";
import EnemyImage from "./sections/EnemyImage";
import EnemyMoves from "./sections/EnemyMoves";
import EnemyBehavior from "./sections/EnemyBehavior";

export default function EnemyInspector({ selected, update }) {
  return (
    <>
      <EnemyIdentity selected={selected} update={update} />
      <EnemyImage selected={selected} update={update} />
      <EnemyMoves selected={selected} update={update} />
      <EnemyBehavior selected={selected} update={update} />
    </>
  );
}