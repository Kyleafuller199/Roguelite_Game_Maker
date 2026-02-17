/**
 * initialState.js
 *
 * Defines the initial editor state for both:
 * - Asset Mode (global asset editing)
 * - Project Mode (game composition and character setup)
 *
 * Architecture Principles:
 * - Normalized storage (byId + allIds) for scalable updates
 * - Global assets are separate from project composition
 * - Projects reference assets by ID (never by object copy)
 * - Characters belong to projects but reference global assets
 */

export const initialState = {
  /**
   * -------------------------------------------------------
   * EDITOR MODE STATE
   * -------------------------------------------------------
   */

  // Current editor mode ("assets" | later: "project")
  mode: "assets",

  // Which global asset type is currently being edited
  entityType: "card",

  // ID of the currently selected asset (in asset mode)
  selectedId: "card_basic_strike",

  /**
   * -------------------------------------------------------
   * GLOBAL ASSETS (Normalized)
   * -------------------------------------------------------
   *
   * Each asset type is stored as:
   * {
   *   byId: { [id]: assetObject },
   *   allIds: [id, id, id]
   * }
   *
   * Why:
   * - O(1) lookup by id
   * - Predictable iteration order
   * - Easy backend syncing
   */

  assets: {
    /**
     * -------------------------
     * CARDS
     * -------------------------
     */
    cards: {
      byId: {
        card_basic_strike: {
          id: "card_basic_strike",
          name: "Basic Strike",
          type: "Attack",
          rarity: "Common",
          cost: 1,
        },
        card_2: {
          id: "card_2",
          name: "Card 2",
          type: "Skill",
          rarity: "Common",
          cost: 1,
        },
      },
      allIds: ["card_basic_strike", "card_2"],
    },

    /**
     * -------------------------
     * RELICS
     * -------------------------
     */
    relics: {
      byId: {
        relic_ancient_coin: {
          id: "relic_ancient_coin",
          imageId: "",
          identity: { name: "Ancient Coin", rarity: "Rare" },
          effects: [],
          triggers: [],
        },
        relic_burning_blood: {
          id: "relic_burning_blood",
          imageId: "",
          identity: { name: "Burning Blood", rarity: "Starter" },
          effects: [],
          triggers: [],
        },
      },
      allIds: ["relic_ancient_coin", "relic_burning_blood"],
    },

    /**
     * -------------------------
     * POTIONS
     * -------------------------
     */
    potions: {
      byId: {
        potion_fire: {
          id: "potion_fire",
          imageId: "",
          imageUrl: "", // V1 — will likely become imageId only
          identity: {
            name: "Fire Potion",
            rarity: "Common",
            useContext: "anyTime",
          },
          effects: [],
        },
        potion_strength: {
          id: "potion_strength",
          imageId: "",
          imageUrl: "",
          identity: {
            name: "Strength Potion",
            rarity: "Uncommon",
            useContext: "anyTime",
          },
          effects: [],
        },
      },
      allIds: ["potion_fire", "potion_strength"],
    },

    /**
     * -------------------------
     * ENEMIES
     * -------------------------
     *
     * Note:
     * This structure is currently simpler than relic/potion.
     * You may want to align enemy structure to:
     * {
     *   identity: {...},
     *   moves: [],
     *   behavior: {}
     * }
     */
    enemies: {
      byId: {
        enemy_slime: { id: "enemy_slime", name: "Green Slime", hp: 28 },
        enemy_cultist: { id: "enemy_cultist", name: "Cultist", hp: 50 },
      },
      allIds: ["enemy_slime", "enemy_cultist"],
    },
  },

  /**
   * -------------------------------------------------------
   * PROJECT MODE STATE
   * -------------------------------------------------------
   *
   * Separate from asset editing.
   * Projects compose global assets into playable structures.
   */

  project: {
    /**
     * Which node is selected in the project sidebar tree.
     * This allows tree-based UI without storing UI logic in assets.
     */
    selectedNode: { kind: "project", projectId: "p1" },

    /**
     * Expansion state for collapsible tree UI.
     * Keys are controlled by ProjectSidebar.
     */
    expanded: {
      "project:p1": true,
      "project:p1:pools": true,
      "project:p1:characters": true,
      "project:p1:acts": false,
    },

    /**
     * -------------------------
     * PROJECTS (Normalized)
     * -------------------------
     */
    projects: {
      byId: {
        p1: {
          id: "p1",
          name: "Demo Project",

          /**
           * Project-level pools reference global asset IDs.
           * Never store full asset objects here.
           */
          pools: {
            cards: ["card_basic_strike", "card_2"],
            relics: ["relic_burning_blood"],
            potions: ["potion_fire"],
            enemies: ["enemy_slime", "enemy_cultist"],
          },

          /**
           * Act composition (enemy/event distribution).
           * References global enemy IDs.
           */
          acts: {
            1: { basics: ["enemy_slime"], elites: [], bosses: [], events: [] },
            2: { basics: ["enemy_cultist"], elites: [], bosses: [], events: [] },
            3: { basics: [], elites: [], bosses: [], events: [] },
          },

          /**
           * Characters that belong to this project.
           */
          characterIds: ["c1"],
        },
      },
      allIds: ["p1"],
    },

    /**
     * -------------------------
     * CHARACTERS (Normalized)
     * -------------------------
     *
     * Characters belong to a project (via projectId),
     * but reference global assets.
     */
    characters: {
      byId: {
        c1: {
          id: "c1",
          projectId: "p1",
          name: "Hero",

          // References global relic
          startingRelicId: "relic_burning_blood",

          // Deck references global card IDs
          startingDeck: [
            { cardId: "card_basic_strike", count: 5 },
          ],

          /**
           * Optional character-specific pools.
           * Empty = inherits project-level pools.
           */
          pools: {
            cards: [],
            relics: [],
          },
        },
      },
      allIds: ["c1"],
    },
  },
};