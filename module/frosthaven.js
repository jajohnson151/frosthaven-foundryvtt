//import { frosthaven } from "./config.js"
import frosthavenItemSheet from "./sheets/frosthavenItemSheet.js"

Hooks.once("init", function () {
    console.log("frosthaven | Initializing system");

    //CONFIG.frosthaven = frosthaven;

    // Unregister the default sheet so it's not an option users can switch to
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("frosthaven", frosthavenItemSheet, { makeDefault: true });
});