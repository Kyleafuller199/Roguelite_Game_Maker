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
 *
 * Demo content is based on the Ironclad character from Slay the Spire
 * and uses the sprites available in roguelite_map_generator/assets/.
 */

export const initialState = {
  mode: "assets",
  entityType: "card",
  selectedId: "card_strike",

  // ─────────────────────────────────────────────────────────────────────────
  // GLOBAL ASSETS
  // ─────────────────────────────────────────────────────────────────────────

  assets: {

    // ── CARDS ──────────────────────────────────────────────────────────────
    cards: {
      byId: {

        // ── Starter ────────────────────────────────────────────────────────

        card_strike: {
          id: "card_strike", name: "Strike", type: "Attack", rarity: "Starter", cost: 1, imageUrl: "strike.png",
          effects: [{ id: "eff_strike_dmg", effectType: "damage", baseValue: 6, target: "selectedEnemy", repeat: 1 }],
        },

        card_defend: {
          id: "card_defend", name: "Defend", type: "Skill", rarity: "Starter", cost: 1, imageUrl: "defend.png",
          effects: [{ id: "eff_defend_block", effectType: "block", baseValue: 5, target: "self", repeat: 1 }],
        },

        card_bash: {
          id: "card_bash", name: "Bash", type: "Attack", rarity: "Starter", cost: 2, imageUrl: "bash.png",
          effects: [
            { id: "eff_bash_dmg",  effectType: "damage",      baseValue: 8, target: "selectedEnemy", repeat: 1 },
            { id: "eff_bash_vuln", effectType: "vulnerable",  baseValue: 2, target: "selectedEnemy", repeat: 1 },
          ],
        },

        // ── Common Attacks ─────────────────────────────────────────────────

        card_headbutt: {
          id: "card_headbutt", name: "Headbutt", type: "Attack", rarity: "Common", cost: 1, imageUrl: "strike.png",
          effects: [{ id: "eff_headbutt_dmg", effectType: "damage", baseValue: 9, target: "selectedEnemy", repeat: 1 }],
        },

        card_pommel_strike: {
          id: "card_pommel_strike", name: "Pommel Strike", type: "Attack", rarity: "Common", cost: 1, imageUrl: "strike.png",
          effects: [
            { id: "eff_pommel_dmg",  effectType: "damage", baseValue: 9, target: "selectedEnemy", repeat: 1 },
            { id: "eff_pommel_draw", effectType: "draw",   baseValue: 1, target: "self",          repeat: 1 },
          ],
        },

        card_wild_strike: {
          id: "card_wild_strike", name: "Wild Strike", type: "Attack", rarity: "Common", cost: 1, imageUrl: "strike.png",
          effects: [{ id: "eff_wild_dmg", effectType: "damage", baseValue: 12, target: "selectedEnemy", repeat: 1 }],
        },

        card_twin_strike: {
          id: "card_twin_strike", name: "Twin Strike", type: "Attack", rarity: "Common", cost: 1, imageUrl: "twin-strike.png",
          effects: [{ id: "eff_twin_dmg", effectType: "damage", baseValue: 5, target: "selectedEnemy", repeat: 2 }],
        },

        card_sword_boomerang: {
          id: "card_sword_boomerang", name: "Sword Boomerang", type: "Attack", rarity: "Common", cost: 1, imageUrl: "strike.png",
          effects: [{ id: "eff_boomerang_dmg", effectType: "damage", baseValue: 3, target: "randomEnemy", repeat: 3 }],
        },

        card_thunderclap: {
          id: "card_thunderclap", name: "Thunderclap", type: "Attack", rarity: "Common", cost: 1, imageUrl: "bash.png",
          effects: [
            { id: "eff_thunder_dmg",  effectType: "damage",     baseValue: 4, target: "allEnemies",    repeat: 1 },
            { id: "eff_thunder_vuln", effectType: "vulnerable", baseValue: 1, target: "selectedEnemy", repeat: 1 },
          ],
        },

        card_clothesline: {
          id: "card_clothesline", name: "Clothesline", type: "Attack", rarity: "Common", cost: 2, imageUrl: "bash.png",
          effects: [
            { id: "eff_cloth_dmg",  effectType: "damage", baseValue: 12, target: "selectedEnemy", repeat: 1 },
            { id: "eff_cloth_weak", effectType: "weak",   baseValue: 2,  target: "selectedEnemy", repeat: 1 },
          ],
        },

        card_reckless_charge: {
          id: "card_reckless_charge", name: "Reckless Charge", type: "Attack", rarity: "Common", cost: 0, imageUrl: "strike.png",
          effects: [{ id: "eff_reckless_dmg", effectType: "damage", baseValue: 7, target: "selectedEnemy", repeat: 1 }],
        },

        // ── Common Skills ──────────────────────────────────────────────────

        card_shrug_it_off: {
          id: "card_shrug_it_off", name: "Shrug It Off", type: "Skill", rarity: "Common", cost: 1, imageUrl: "defend.png",
          effects: [
            { id: "eff_shrug_block", effectType: "block", baseValue: 8, target: "self", repeat: 1 },
            { id: "eff_shrug_draw",  effectType: "draw",  baseValue: 1, target: "self", repeat: 1 },
          ],
        },

        card_true_grit: {
          id: "card_true_grit", name: "True Grit", type: "Skill", rarity: "Common", cost: 1, imageUrl: "defend.png",
          effects: [{ id: "eff_truegrit_block", effectType: "block", baseValue: 7, target: "self", repeat: 1 }],
        },

        card_armaments: {
          id: "card_armaments", name: "Armaments", type: "Skill", rarity: "Common", cost: 1, imageUrl: "defend.png",
          effects: [{ id: "eff_arm_block", effectType: "block", baseValue: 5, target: "self", repeat: 1 }],
        },

        card_flex: {
          id: "card_flex", name: "Flex", type: "Skill", rarity: "Common", cost: 0, imageUrl: "defend.png",
          effects: [{ id: "eff_flex_str", effectType: "strength", baseValue: 2, target: "self", repeat: 1 }],
        },

        card_seeing_red: {
          id: "card_seeing_red", name: "Seeing Red", type: "Skill", rarity: "Common", cost: 1, imageUrl: "defend.png",
          effects: [{ id: "eff_seered_energy", effectType: "gainEnergy", baseValue: 2, target: "self", repeat: 1 }],
        },

        // ── Uncommon / Rare ────────────────────────────────────────────────

        card_inflame: {
          id: "card_inflame", name: "Inflame", type: "Power", rarity: "Uncommon", cost: 1, imageUrl: "bash.png",
          effects: [{ id: "eff_inflame_str", effectType: "strength", baseValue: 2, target: "self", repeat: 1 }],
        },

        card_battle_trance: {
          id: "card_battle_trance", name: "Battle Trance", type: "Skill", rarity: "Uncommon", cost: 0, imageUrl: "defend.png",
          effects: [{ id: "eff_trance_draw", effectType: "draw", baseValue: 3, target: "self", repeat: 1 }],
        },

        card_carnage: {
          id: "card_carnage", name: "Carnage", type: "Attack", rarity: "Uncommon", cost: 2, imageUrl: "bash.png",
          exhaust: true,
          effects: [{ id: "eff_carnage_dmg", effectType: "damage", baseValue: 20, target: "selectedEnemy", repeat: 1 }],
        },

        card_pummel: {
          id: "card_pummel", name: "Pummel", type: "Attack", rarity: "Uncommon", cost: 1, imageUrl: "strike.png",
          exhaust: true,
          effects: [{ id: "eff_pummel_dmg", effectType: "damage", baseValue: 2, target: "selectedEnemy", repeat: 4 }],
        },

        card_second_wind: {
          id: "card_second_wind", name: "Second Wind", type: "Skill", rarity: "Uncommon", cost: 1, imageUrl: "defend.png",
          effects: [{ id: "eff_sw_block", effectType: "block", baseValue: 5, target: "self", repeat: 1 }],
        },

        card_block_pile: {
          id: "card_block_pile", name: "Block Pile", type: "Skill", rarity: "Rare", cost: 1, imageUrl: "block-pile.png",
          retain: true,
          effects: [
            { id: "eff_bp_block", effectType: "block", baseValue: 5, target: "self",      repeat: 1 },
            { id: "eff_bp_weak",  effectType: "weak",  baseValue: 1, target: "self",      repeat: 1 },
          ],
          scaling: [
            { id: "scale_bp", appliesToEffectId: "eff_bp_block", basedOn: "cardsInHand", operation: "add", amountPerUnit: 5, cap: null },
          ],
        },

        card_whirlwind: {
          id: "card_whirlwind", name: "Whirlwind", type: "Attack", rarity: "Rare", cost: 0, imageUrl: "bash.png",
          effects: [{ id: "eff_whirl_dmg", effectType: "damage", baseValue: 5, target: "allEnemies", repeat: 3 }],
        },

        // ── Curses ─────────────────────────────────────────────────────────

        card_injured: {
          id: "card_injured", name: "Injured", type: "Curse", rarity: "Curse", cost: 1, imageUrl: "injured.png",
          exhaust: true,
          effects: [{ id: "eff_injured_vuln", effectType: "vulnerable", baseValue: 1, target: "self", repeat: 1, trigger: "onDraw" }],
        },
      },

      allIds: [
        "card_strike", "card_defend", "card_bash",
        "card_headbutt", "card_pommel_strike", "card_wild_strike",
        "card_twin_strike", "card_sword_boomerang", "card_thunderclap",
        "card_clothesline", "card_reckless_charge",
        "card_shrug_it_off", "card_true_grit", "card_armaments",
        "card_flex", "card_seeing_red",
        "card_inflame", "card_battle_trance", "card_carnage",
        "card_pummel", "card_second_wind", "card_block_pile", "card_whirlwind",
        "card_injured",
      ],
    },

    // ── RELICS ─────────────────────────────────────────────────────────────
    relics: {
      byId: {
        relic_burning_blood: {
          id: "relic_burning_blood",
          imageUrl: "burning-blood.png",
          identity: { name: "Burning Blood", rarity: "Starter" },
          effects: [{ id: "eff_bb_heal", effectType: "heal", baseValue: 6, repeat: 1, target: "self" }],
          triggers: [{ id: "trg_bb", event: "startOfCombat", effectIds: ["eff_bb_heal"] }],
        },

        relic_orichalcum: {
          id: "relic_orichalcum",
          imageUrl: "burning-blood.png",
          identity: { name: "Orichalcum", rarity: "Uncommon" },
          effects: [{ id: "eff_ori_block", effectType: "block", baseValue: 6, repeat: 1, target: "self" }],
          triggers: [{ id: "trg_ori", event: "startOfTurn", effectIds: ["eff_ori_block"] }],
        },

        relic_philosophers_stone: {
          id: "relic_philosophers_stone",
          imageUrl: "burning-blood.png",
          identity: { name: "Philosopher's Stone", rarity: "Boss" },
          effects: [
            { id: "eff_ps_str",  effectType: "strength", baseValue: 1, repeat: 1, target: "self" },
          ],
          triggers: [{ id: "trg_ps", event: "startOfCombat", effectIds: ["eff_ps_str"] }],
        },

        relic_bag_of_prep: {
          id: "relic_bag_of_prep",
          imageUrl: "burning-blood.png",
          identity: { name: "Bag of Preparation", rarity: "Uncommon" },
          effects: [{ id: "eff_bop_draw", effectType: "draw", baseValue: 2, repeat: 1, target: "self" }],
          triggers: [{ id: "trg_bop", event: "startOfCombat", effectIds: ["eff_bop_draw"] }],
        },
      },

      allIds: ["relic_burning_blood", "relic_orichalcum", "relic_philosophers_stone", "relic_bag_of_prep"],
    },

    // ── POTIONS ────────────────────────────────────────────────────────────
    potions: {
      byId: {
        potion_fire: {
          id: "potion_fire",
          imageUrl: "flame-potion.png",
          identity: { name: "Fire Potion", rarity: "Common", useContext: "combatOnly" },
          effects: [{ id: "eff_fire_dmg", effectType: "damage", baseValue: 20, target: "selectedEnemy", repeat: 1 }],
        },
        potion_life: {
          id: "potion_life",
          imageUrl: "life-potion.png",
          identity: { name: "Life Potion", rarity: "Rare", useContext: "anyTime" },
          effects: [{ id: "eff_life_heal", effectType: "heal", baseValue: 30, target: "self", repeat: 1 }],
        },
        potion_block: {
          id: "potion_block",
          imageUrl: "block-potion.png",
          identity: { name: "Block Potion", rarity: "Common", useContext: "combatOnly" },
          effects: [{ id: "eff_block_pot", effectType: "block", baseValue: 12, target: "self", repeat: 1 }],
        },
        potion_strength: {
          id: "potion_strength",
          imageUrl: "regen-potion.png",
          identity: { name: "Strength Potion", rarity: "Uncommon", useContext: "combatOnly" },
          effects: [{ id: "eff_str_pot", effectType: "strength", baseValue: 3, target: "self", repeat: 1 }],
        },
      },
      allIds: ["potion_fire", "potion_life", "potion_block", "potion_strength"],
    },

    // ── ENEMIES ────────────────────────────────────────────────────────────
    enemies: {
      byId: {

        // ── Basics ─────────────────────────────────────────────────────────

        enemy_slime: {
          id: "enemy_slime",
          imageUrl: "slime.png",
          identity: { name: "Slime", type: "basic", startingHealth: 40, startingBlock: 0 },
          moves: [
            {
              id: "move_slime_tackle", name: "Tackle",
              effects: [{ id: "eff_slime_tackle", effectType: "damage", baseValue: 5, target: "player", repeat: 1 }],
            },
            {
              id: "move_slime_goo", name: "Goo",
              effects: [{ id: "eff_slime_goo", effectType: "weak", baseValue: 1, target: "player", repeat: 1 }],
            },
            {
              id: "move_slime_slam", name: "Slam",
              effects: [{ id: "eff_slime_slam", effectType: "damage", baseValue: 8, target: "player", repeat: 1 }],
            },
          ],
          behavior: { behaviorType: "cycle", cycleOrder: ["move_slime_tackle", "move_slime_goo", "move_slime_tackle", "move_slime_slam"] },
        },

        enemy_jaw_worm: {
          id: "enemy_jaw_worm",
          imageUrl: "jaw-worm.png",
          identity: { name: "Jaw Worm", type: "basic", startingHealth: 42, startingBlock: 0 },
          moves: [
            {
              id: "move_jw_chomp", name: "Chomp",
              effects: [{ id: "eff_jw_chomp", effectType: "damage", baseValue: 11, target: "player", repeat: 1 }],
            },
            {
              id: "move_jw_thrash", name: "Thrash",
              effects: [
                { id: "eff_jw_thrash_dmg",   effectType: "damage", baseValue: 7, target: "player", repeat: 1 },
                { id: "eff_jw_thrash_block",  effectType: "block",  baseValue: 5, target: "self",   repeat: 1 },
              ],
            },
            {
              id: "move_jw_bellow", name: "Bellow",
              effects: [{ id: "eff_jw_bellow", effectType: "strength", baseValue: 3, target: "self", repeat: 1 }],
            },
          ],
          behavior: { behaviorType: "cycle", cycleOrder: ["move_jw_chomp", "move_jw_thrash", "move_jw_chomp", "move_jw_bellow"] },
        },

        enemy_green_louse: {
          id: "enemy_green_louse",
          imageUrl: "louse.png",
          identity: { name: "Green Louse", type: "basic", startingHealth: 12, startingBlock: 0 },
          moves: [
            {
              id: "move_gl_bite", name: "Bite",
              effects: [{ id: "eff_gl_bite", effectType: "damage", baseValue: 5, target: "player", repeat: 1 }],
            },
            {
              id: "move_gl_web", name: "Spit Web",
              effects: [{ id: "eff_gl_web", effectType: "weak", baseValue: 2, target: "player", repeat: 1 }],
            },
          ],
          behavior: { behaviorType: "cycle", cycleOrder: ["move_gl_bite", "move_gl_bite", "move_gl_web"] },
        },

        enemy_spike_slime: {
          id: "enemy_spike_slime",
          imageUrl: "spike-slime.png",
          identity: { name: "Spike Slime", type: "basic", startingHealth: 28, startingBlock: 0 },
          moves: [
            {
              id: "move_ss_flame", name: "Flame Tackle",
              effects: [{ id: "eff_ss_flame", effectType: "damage", baseValue: 8, target: "player", repeat: 1 }],
            },
            {
              id: "move_ss_lunge", name: "Lunge",
              effects: [
                { id: "eff_ss_lunge_dmg",  effectType: "damage",      baseValue: 5, target: "player", repeat: 1 },
                { id: "eff_ss_lunge_vuln", effectType: "vulnerable",   baseValue: 1, target: "player", repeat: 1 },
              ],
            },
          ],
          behavior: { behaviorType: "cycle", cycleOrder: ["move_ss_flame", "move_ss_lunge", "move_ss_flame"] },
        },

        // ── Elites ─────────────────────────────────────────────────────────

        enemy_cultist: {
          id: "enemy_cultist",
          imageUrl: "cultist.png",
          identity: { name: "Cultist", type: "elite", startingHealth: 80, startingBlock: 0 },
          moves: [
            {
              id: "move_cult_incant", name: "Incantation",
              effects: [{ id: "eff_cult_incant", effectType: "strength", baseValue: 3, target: "self", repeat: 1 }],
            },
            {
              id: "move_cult_strike", name: "Dark Strike",
              effects: [{ id: "eff_cult_strike", effectType: "damage", baseValue: 6, target: "player", repeat: 1 }],
            },
          ],
          behavior: { behaviorType: "cycle", cycleOrder: ["move_cult_incant", "move_cult_strike", "move_cult_strike"] },
        },

        enemy_gremlin_nob: {
          id: "enemy_gremlin_nob",
          imageUrl: "gremlin-nob.png",
          identity: { name: "Gremlin Nob", type: "elite", startingHealth: 82, startingBlock: 0 },
          moves: [
            {
              id: "move_gn_bellow", name: "Bellow",
              effects: [
                { id: "eff_gn_bellow_str",  effectType: "strength", baseValue: 2, target: "self",   repeat: 1 },
                { id: "eff_gn_bellow_weak", effectType: "weak",     baseValue: 2, target: "player", repeat: 1 },
              ],
            },
            {
              id: "move_gn_rush", name: "Rush",
              effects: [{ id: "eff_gn_rush", effectType: "damage", baseValue: 14, target: "player", repeat: 1 }],
            },
          ],
          behavior: { behaviorType: "cycle", cycleOrder: ["move_gn_bellow", "move_gn_rush", "move_gn_rush"] },
        },

        enemy_lagavulin: {
          id: "enemy_lagavulin",
          imageUrl: "lagavulin.png",
          identity: { name: "Lagavulin", type: "elite", startingHealth: 109, startingBlock: 8 },
          moves: [
            {
              id: "move_lag_sleep", name: "Sleep",
              effects: [],
            },
            {
              id: "move_lag_siphon", name: "Siphon Soul",
              effects: [
                { id: "eff_lag_siphon_str", effectType: "strength", baseValue: -1, target: "player", repeat: 1 },
              ],
            },
            {
              id: "move_lag_attack", name: "Attack",
              effects: [{ id: "eff_lag_attack", effectType: "damage", baseValue: 18, target: "player", repeat: 1 }],
            },
          ],
          behavior: { behaviorType: "cycle", cycleOrder: ["move_lag_sleep", "move_lag_sleep", "move_lag_siphon", "move_lag_attack"] },
        },

        // ── Bosses ─────────────────────────────────────────────────────────

        enemy_slime_boss: {
          id: "enemy_slime_boss",
          imageUrl: "slime-boss.png",
          identity: { name: "Slime Boss", type: "boss", startingHealth: 140, startingBlock: 0 },
          moves: [
            {
              id: "move_sb_slam", name: "Slam",
              effects: [{ id: "eff_sb_slam", effectType: "damage", baseValue: 35, target: "player", repeat: 1 }],
            },
            {
              id: "move_sb_split", name: "Split",
              effects: [{ id: "eff_sb_split", effectType: "damage", baseValue: 18, target: "player", repeat: 1 }],
            },
          ],
          behavior: { behaviorType: "cycle", cycleOrder: ["move_sb_slam", "move_sb_split", "move_sb_slam"] },
        },

        enemy_hexaghost: {
          id: "enemy_hexaghost",
          imageUrl: "hexaghost.png",
          identity: { name: "Hexaghost", type: "boss", startingHealth: 250, startingBlock: 0 },
          moves: [
            {
              id: "move_hg_activate", name: "Activate",
              effects: [],
            },
            {
              id: "move_hg_inferno", name: "Inferno",
              effects: [{ id: "eff_hg_inferno", effectType: "damage", baseValue: 6, target: "player", repeat: 6 }],
            },
            {
              id: "move_hg_divider", name: "Divider",
              effects: [{ id: "eff_hg_divider", effectType: "damage", baseValue: 4, target: "player", repeat: 3 }],
            },
          ],
          behavior: { behaviorType: "cycle", cycleOrder: ["move_hg_activate", "move_hg_inferno", "move_hg_divider", "move_hg_inferno"] },
        },
      },

      allIds: [
        "enemy_slime", "enemy_jaw_worm", "enemy_green_louse", "enemy_spike_slime",
        "enemy_cultist", "enemy_gremlin_nob", "enemy_lagavulin",
        "enemy_slime_boss", "enemy_hexaghost",
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROJECT MODE STATE
  // ─────────────────────────────────────────────────────────────────────────

  project: {
    selectedNode: { kind: "project", projectId: "p1" },

    expanded: {
      "project:p1": true,
      "project:p1:pools": true,
      "project:p1:characters": true,
      "project:p1:acts": true,
      "character:c1": true,
    },

    projects: {
      byId: {
        p1: {
          id: "p1",
          name: "Demo — Ironclad Run",

          pools: {
            potions: ["potion_fire", "potion_life", "potion_block", "potion_strength"],
            enemies: [
              "enemy_slime", "enemy_jaw_worm", "enemy_green_louse", "enemy_spike_slime",
              "enemy_cultist", "enemy_gremlin_nob", "enemy_lagavulin",
              "enemy_slime_boss", "enemy_hexaghost",
            ],
          },

          acts: {
            1: {
              basics: ["enemy_slime", "enemy_jaw_worm", "enemy_green_louse", "enemy_spike_slime"],
              elites: ["enemy_cultist", "enemy_gremlin_nob"],
              bosses: ["enemy_slime_boss"],
              events: [],
            },
            2: {
              basics: ["enemy_jaw_worm", "enemy_spike_slime"],
              elites: ["enemy_gremlin_nob", "enemy_lagavulin"],
              bosses: ["enemy_hexaghost"],
              events: [],
            },
            3: {
              basics: ["enemy_green_louse", "enemy_slime"],
              elites: ["enemy_cultist", "enemy_lagavulin"],
              bosses: ["enemy_slime_boss", "enemy_hexaghost"],
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
          name: "Ironclad",
          imageUrl: "hero.png",
          startingRelicId: "relic_burning_blood",

          // Classic Ironclad starting deck: 5 Strike, 4 Defend, 1 Bash
          startingDeck: [
            { cardId: "card_strike", count: 5 },
            { cardId: "card_defend", count: 4 },
            { cardId: "card_bash",   count: 1 },
          ],

          // Full card pool available for rewards
          cardPool: [
            "card_strike", "card_defend", "card_bash",
            "card_headbutt", "card_pommel_strike", "card_wild_strike",
            "card_twin_strike", "card_sword_boomerang", "card_thunderclap",
            "card_clothesline", "card_reckless_charge",
            "card_shrug_it_off", "card_true_grit", "card_armaments",
            "card_flex", "card_seeing_red",
            "card_inflame", "card_battle_trance", "card_carnage",
            "card_pummel", "card_second_wind", "card_block_pile", "card_whirlwind",
          ],

          relicPool: [
            "relic_burning_blood",
            "relic_orichalcum",
            "relic_philosophers_stone",
            "relic_bag_of_prep",
          ],
        },
      },
      allIds: ["c1"],
    },
  },
};
