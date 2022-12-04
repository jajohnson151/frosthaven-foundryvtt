/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/frosthaven/templates/actor/parts/actor-combat.html",
    "systems/frosthaven/templates/actor/parts/actor-description.html",
    "systems/frosthaven/templates/actor/parts/actor-items.html",
    "systems/frosthaven/templates/actor/parts/actor-spells.html",
    "systems/frosthaven/templates/actor/parts/actor-features.html",
  ]);
};
