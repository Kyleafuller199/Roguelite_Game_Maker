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

  mode: "assets",
  entityType: "card",
  selectedId: "card_1771487222033",

  /**
   * -------------------------------------------------------
   * GLOBAL ASSETS (Normalized)
   * -------------------------------------------------------
   */

  assets: {
    /**
     * -------------------------
     * CARDS
     * -------------------------
     */
    cards: {
      byId: {
        card_1771487222033: {
          id: "card_1771487222033",
          name: "Strike",
          type: "Attack",
          rarity: "Starter",
          cost: 1,
          imageUrl: "strike.png",
          effects: [
            {
              id: "undefined_1de3819b-0cfd-4de2-b171-698df27e4d81",
              effectType: "damage",
              baseValue: 6,
              target: "selectedEnemy",
              repeat: 1,
            },
          ],
        },

        card_1771487395298: {
          id: "card_1771487395298",
          name: "Bash",
          type: "Attack",
          rarity: "Starter",
          cost: 2,
          imageUrl: "bash.png",
          effects: [
            {
              id: "undefined_d1ddb7bb-f2a8-4828-8297-fbb7fd9f0aab",
              effectType: "damage",
              baseValue: 8,
              target: "selectedEnemy",
              repeat: 1,
            },
            {
              id: "undefined_9d771931-fbb3-4623-9ce6-fb77dc2a1993",
              effectType: "vulnerable",
              baseValue: 2,
              target: "selectedEnemy",
              repeat: 1,
            },
          ],
        },

        card_1771487466006: {
          id: "card_1771487466006",
          name: "Twin Strike",
          type: "Attack",
          rarity: "Common",
          cost: 1,
          imageUrl: "twin-strike.png",
          effects: [
            {
              id: "undefined_709f90da-4512-4d17-9b89-3cfd5d3dd744",
              effectType: "damage",
              baseValue: 5,
              target: "selectedEnemy",
              repeat: 2,
            },
          ],
        },

        card_1771554405482: {
          id: "card_1771554405482",
          name: "Block Pile",
          type: "Skill",
          rarity: "Rare",
          cost: 1,
          imageUrl: "block-pile.png",
          retain: true,
          effects: [
            {
              id: "eff_8f7d5601-fe82-4fc7-b890-0b91f8d482df",
              effectType: "block",
              baseValue: 5,
              target: "self",
              repeat: 1,
            },
            {
              id: "eff_8c5cff9b-481f-4b63-a462-61a0b8a05038",
              effectType: "weak",
              baseValue: 1,
              target: "self",
              repeat: 1,
            },
          ],
          scaling: [
            {
              id: "scale_133234da-6f74-4eed-b95f-04fe51a438ab",
              appliesToEffectId: "eff_8f7d5601-fe82-4fc7-b890-0b91f8d482df",
              basedOn: "cardsInHand",
              operation: "add",
              amountPerUnit: 5,
              cap: null,
            },
          ],
        },

        "card_eb2b2181-1d2e-4d5f-b808-8a284a098435": {
          id: "card_eb2b2181-1d2e-4d5f-b808-8a284a098435",
          name: "Defend",
          type: "Skill",
          rarity: "Starter",
          cost: 1,
          imageUrl: "defend.png",
          effects: [
            {
              id: "eff_b2ddcbb2-e493-4175-8074-e2617ee0bc63",
              effectType: "block",
              baseValue: 5,
              target: "self",
              repeat: 1,
            },
          ],
        },

        "card_9a891ebb-46f7-4501-9064-4588b1a6325d": {
          id: "card_9a891ebb-46f7-4501-9064-4588b1a6325d",
          name: "Injured",
          type: "Curse",
          rarity: "Curse",
          cost: 1,
          imageUrl: "injured.png",
          exhaust: true,
          effects: [
            {
              id: "eff_ae2305ad-5606-44b9-8342-d57ac513f7d6",
              effectType: "vulnerable",
              baseValue: 1,
              target: "self",
              repeat: 1,
              trigger: "onDraw",
            },
          ],
        },
      },
      allIds: [
        "card_1771487222033",
        "card_1771487395298",
        "card_1771487466006",
        "card_1771554405482",
        "card_eb2b2181-1d2e-4d5f-b808-8a284a098435",
        "card_9a891ebb-46f7-4501-9064-4588b1a6325d",
      ],
    },

    /**
     * -------------------------
     * RELICS
     * -------------------------
     */
    relics: {
      byId: {
        relic_1771486391539: {
          id: "relic_1771486391539",
          imageUrl: "burning-blood.png",
          identity: { name: "Burning Blood", rarity: "Starter" },
          effects: [
            {
              id: "eff_2f057ef6-f3ef-4f09-af76-0769a2c9f1f8",
              effectType: "heal",
              baseValue: 6,
              repeat: 1,
              target: "self",
            },
          ],
          triggers: [
            {
              id: "trg_ec294c70-4412-4bf8-895b-7e487fa6d128",
              event: "startOfCombat",
              effectIds: ["eff_2f057ef6-f3ef-4f09-af76-0769a2c9f1f8"],
            },
          ],
        },
      },
      allIds: ["relic_1771486391539"],
    },

    /**
     * -------------------------
     * POTIONS
     * -------------------------
     */
    potions: {
      byId: {
        potion_1771488136617: {
          id: "potion_1771488136617",
          imageUrl: "flame-potion.png",
          identity: { name: "Fire Potion", rarity: "Common", useContext: "combatOnly" },
          effects: [
            {
              id: "eff_c4b7d994-db22-432e-b4c5-4c597638b421",
              effectType: "damage",
              baseValue: 20,
              target: "selectedEnemy",
              repeat: 1,
            },
          ],
        },

        potion_1771488167978: {
          id: "potion_1771488167978",
          imageUrl: "regen-potion.png",
          identity: { name: "Heal Potion", rarity: "Common", useContext: "anyTime" },
          effects: [
            {
              id: "eff_66b0a37e-4ef9-4847-828f-f59afe72c86d",
              effectType: "heal",
              baseValue: 8,
              target: "self",
              repeat: 1,
            },
          ],
        },

        "potion_93cebb76-2f10-4933-969c-b308e1e21847": {
          id: "potion_93cebb76-2f10-4933-969c-b308e1e21847",
          imageUrl: "block-potion.png",
          identity: { name: "Block Potion", rarity: "Common", useContext: "combatOnly" },
          effects: [
            {
              id: "eff_6f7dd938-a5f7-4b99-a256-855142b3267e",
              effectType: "block",
              baseValue: 12,
              target: "self",
              repeat: 1,
            },
          ],
        },

        "potion_5ff3cfa1-ba2c-4b42-9df0-2b92b0b39657": {
          id: "potion_5ff3cfa1-ba2c-4b42-9df0-2b92b0b39657",
          imageUrl: "block-heal-potion.png",
          identity: { name: "Block & Heal Potion", rarity: "Uncommon", useContext: "combatOnly" },
          effects: [
            {
              id: "eff_3c4a492c-5fb1-4e67-ab47-c7bde9280eb0",
              effectType: "block",
              baseValue: 8,
              target: "self",
              repeat: 1,
            },
            {
              id: "eff_block-heal-potion-heal",
              effectType: "heal",
              baseValue: 8,
              target: "self",
              repeat: 1,
            },
          ],
        },
      },
      allIds: [
        "potion_1771488136617",
        "potion_1771488167978",
        "potion_93cebb76-2f10-4933-969c-b308e1e21847",
        "potion_5ff3cfa1-ba2c-4b42-9df0-2b92b0b39657",
      ],
    },

    /**
     * -------------------------
     * ENEMIES
     * -------------------------
     */
    enemies: {
      byId: {
        enemy_1771490203678: {
          id: "enemy_1771490203678",
          imageUrl: "cultist.png",
          identity: {
            name: "Cultist",
            type: "basic",
            startingHealth: 50,
            startingBlock: 30,
          },
          moves: [
            {
              id: "move_8fc36e71-00c7-43ad-82e0-6b0b590067ab",
              name: "Charge",
              effects: [
                {
                  id: "eff_75c59a35-f133-4e4d-9e7c-73571d45ef82",
                  effectType: "strength",
                  baseValue: 5,
                  target: "self",
                  repeat: 1,
                },
              ],
            },
            {
              id: "move_446d0218-7935-4869-a938-785a65b2c6e9",
              name: "Smack",
              effects: [
                {
                  id: "eff_281c673c-cf85-4922-bc71-f5905e91a3c2",
                  effectType: "damage",
                  baseValue: 6,
                  target: "player",
                  repeat: 1,
                },
              ],
            },
          ],
          behavior: {
            behaviorType: "cycle",
            cycleOrder: [
              "move_8fc36e71-00c7-43ad-82e0-6b0b590067ab",
              "move_446d0218-7935-4869-a938-785a65b2c6e9",
              "move_446d0218-7935-4869-a938-785a65b2c6e9",
            ],
          },
        },

        "enemy_a69783db-f913-4ab1-8b4a-fff313c87298": {
          id: "enemy_a69783db-f913-4ab1-8b4a-fff313c87298",
          imageUrl: "slime.png",
          identity: {
            name: "Slime",
            type: "basic",
            startingHealth: 40,
            startingBlock: 0,
          },
          moves: [],
          behavior: { behaviorType: "cycle", cycleOrder: [] },
        },
      },
      allIds: [
        "enemy_1771490203678",
        "enemy_a69783db-f913-4ab1-8b4a-fff313c87298",
      ],
    },
  },

  /**
   * -------------------------------------------------------
   * PROJECT MODE STATE
   * -------------------------------------------------------
   */

  project: {
    selectedNode: { kind: "project", projectId: "p1" },

    expanded: {
      "project:p1": true,
      "project:p1:pools": true,
      "project:p1:characters": true,
      "project:p1:acts": false,
      "character:c1": true,
    },

    projects: {
      byId: {
        p1: {
          id: "p1",
          name: "Demo Project",

          pools: {
            potions: [
              "potion_1771488136617",
              "potion_1771488167978",
              "potion_93cebb76-2f10-4933-969c-b308e1e21847",
              "potion_5ff3cfa1-ba2c-4b42-9df0-2b92b0b39657",
            ],
            enemies: [
              "enemy_1771490203678",
              "enemy_a69783db-f913-4ab1-8b4a-fff313c87298",
            ],
          },

          acts: {
            1: {
              basics: [
                "enemy_1771490203678",
                "enemy_a69783db-f913-4ab1-8b4a-fff313c87298",
              ],
              elites: [],
              bosses: [],
              events: [],
            },
            2: {
              basics: [
                "enemy_1771490203678",
                "enemy_a69783db-f913-4ab1-8b4a-fff313c87298",
              ],
              elites: [],
              bosses: [],
              events: [],
            },
            3: {
              basics: [
                "enemy_1771490203678",
                "enemy_a69783db-f913-4ab1-8b4a-fff313c87298",
              ],
              elites: [],
              bosses: [],
              events: [],
            },
          },

          characterIds: ["c1"],
        },
      },
      allIds: ["p1"],
    },

    characters: {
      byId: {
        c1: {
          id: "c1",
          projectId: "p1",
          name: "Hero",
          imageUrl: "hero.png",
          startingRelicId: "relic_1771486391539",
          startingDeck: [
            { cardId: "card_1771487222033", count: 5 },
            { cardId: "card_1771487395298", count: 1 },
            { cardId: "card_eb2b2181-1d2e-4d5f-b808-8a284a098435", count: 5 },
          ],
          cardPool: [
            "card_1771487222033",
            "card_1771487395298",
            "card_1771487466006",
            "card_1771554405482",
            "card_eb2b2181-1d2e-4d5f-b808-8a284a098435",
            "card_9a891ebb-46f7-4501-9064-4588b1a6325d",
          ],
          relicPool: ["relic_1771486391539"],
        },
      },
      allIds: ["c1"],
    },
  },
};
