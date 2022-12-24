// Import document classes.
import { FrosthavenActor } from "./documents/actor.mjs";
import { FrosthavenItem } from "./documents/item.mjs";
// Import sheet classes.
import { FrosthavenActorSheet } from "./sheets/actor-sheet.mjs";
import { FrosthavenItemSheet } from "./sheets/item-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { FROSTHAVEN } from "./helpers/config.mjs";
import { MyTokenHUD } from "./helpers/my-token-hud.mjs";
import { FrosthavenNewMonsterSelect } from "./documents/new-monster-select.mjs"

/**
 * Define your class that extends FormApplication
 */
class MyFormApplication extends FormApplication {
  constructor(exampleOption) {
    super();
    this.exampleOption = exampleOption;
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['form'],
      popOut: true,
      template: "systems/frosthaven/templates/actor/add-monster-sheet.html",
      id: 'new-monster-form-application',
      title: 'Add new monster to map',
    });
  }

  getData() {
    // Send data to the template
    return {
      msg: this.exampleOption,
      color: 'red',
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  async _updateObject(event, formData) {
    console.log(formData.exampleInput);
  }
}






/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function () {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.frosthaven = {
    FrosthavenActor,
    FrosthavenItem,
    rollItemMacro
  };

  // Add custom constants for configuration.
  CONFIG.FROSTHAVEN = FROSTHAVEN;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "max(1, 1d6 + @abilities.dex.bonus + @initBonus.value)",
    decimals: 0
  };

  // Define new effects
  CONFIG.statusEffects = [
    {
      id: "dead",
      label: "EFFECT.StatusDead",
      icon: "icons/svg/skull.svg"
    },
    {
      id: "wound",
      label: "FROSTHAVEN.StatusWounded",
      icon: "systems/frosthaven/module/icons/wound.png"
    },
    {
      id: "bane",
      label: "FROSTHAVEN.StatusBane",
      icon: "systems/frosthaven/module/icons/bane.png"
    },
    {
      id: "poison",
      label: "EFFECT.StatusPoison",
      icon: "systems/frosthaven/module/icons/poison.png"
    },
    {
      id: "immobilize",
      label: "FROSTHAVEN.StatusImmobilized",
      icon: "systems/frosthaven/module/icons/immobilize.png"
    },
    {
      id: "disarm",
      label: "FROSTHAVEN.StatusDisarm",
      icon: "systems/frosthaven/module/icons/disarm.png"
    },
    {
      id: "impair",
      label: "FROSTHAVEN.StatusImpaired",
      icon: "systems/frosthaven/module/icons/impair.png"
    },
    {
      id: "stun",
      label: "EFFECT.StatusStunned",
      icon: "systems/frosthaven/module/icons/stun.png"
    },
    {
      id: "muddle",
      label: "FROSTHAVEN.StatusMuddled",
      icon: "systems/frosthaven/module/icons/muddle.png"
    },
    {
      id: "regenerate",
      label: "FROSTHAVEN.StatusRegenerate",
      icon: "systems/frosthaven/module/icons/regenerate.png"
    },
    {
      id: "ward",
      label: "FROSTHAVEN.StatusWard",
      icon: "systems/frosthaven/module/icons/ward.png"
    },
    {
      id: "invisible",
      label: "EFFECT.StatusInvisible",
      icon: "systems/frosthaven/module/icons/invisible.png"
    },
    {
      id: "strengthen",
      label: "FROSTHAVEN.StatusStrengthen",
      icon: "systems/frosthaven/module/icons/strengthen.png"
    }
  ];

  // Define custom Document classes
  CONFIG.Actor.documentClass = FrosthavenActor;
  CONFIG.Item.documentClass = FrosthavenItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("frosthaven", FrosthavenActorSheet, { makeDefault: true });
  //Actors.registerSheet("frosthaven", FrosthavenNewMonsterSelect, { makeDefault: false });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("frosthaven", FrosthavenItemSheet, { makeDefault: true });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function () {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('localizeLowerCase', function (str) {
  return game.i18n.localize(str).toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Character Creation Hooks                    */
/* -------------------------------------------- */

Hooks.on("createActor", async function (actor) {
  if (actor.type === "character") {
    actor.data.token.actorLink = true;
  }
});

/* -------------------------------------------- */
/*  Token Creation Hooks                        */
/* -------------------------------------------- */

Hooks.on("createToken", async function (token, options, id) {
  if (token.actor.type === "badguy") {
    let newHealth = new Roll(`${token.actor.system.hitDice.number}${token.actor.system.hitDice.size}+${token.actor.system.hitDice.mod}`);
    await newHealth.evaluate({ async: true });
    token.actor.system.health.value = Math.max(1, newHealth.total);
    token.actor.system.health.max = Math.max(1, newHealth.total);
    var retVal = confirm("Do you want to continue ?");
  }
  console.log("a new token is being created")
  //new NewMonsterSelectFormApplication('example').render(true);
  if (token.actor.type === "monster") {
    token.displayBars = CONST.TOKEN_DISPLAY_MODES.HOVER;
    token.displayName = CONST.TOKEN_DISPLAY_MODES.ALWAYS;
    token.actor.system.originalName = token.actor.name;

    // Inspect all the tokens in the current scene with the same actor name.
    // Assign the next high (unused) index
    var count = 0;
    var maxIndex = -1;
    var indexList = [];
    game.scenes.current.tokens.forEach(t => {
      count = count + 1;
      console.log(count + " " + t.actor.name);
      if (token.actor.name === t.actor.system.originalName) {
        if (maxIndex < t.actor.system.index.value) maxIndex = t.actor.system.index.value;
        indexList[t.actor.system.index.value] = true;
      }
      else {
        console.log("No match: " + token.actor.name + " vs " + t.actor.name);
      }
    }
    );
    console.log(indexList);
    var nextIndex = -1;
    // Look for the first unused slot
    for (let i = 1; i <= maxIndex; i++) {
      if (indexList[i] !== true) {
        nextIndex = i;
        break;
      }
    }
    if (nextIndex === -1) {
      nextIndex = maxIndex + 1;
    }
    token.actor.system.index.value = nextIndex;
    token.name = token.name + " " + nextIndex;
    token.actor.name = token.name;
    //const status = new FrosthavenNewMonsterSelect(token.actor).render(true);
    //console.log("form has completed, status= ");
    //console.log(status);
  }
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
  const item = data.data;

  // Create the macro command
  const command = `game.frosthaven.rollItemMacro("${item.name}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "frosthaven.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}

