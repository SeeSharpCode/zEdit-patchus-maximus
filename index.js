/* global ngapp, xelib */
//=require src/patchers/*.js
//=require src/crafting.js

const loadConfig = function(name) {
    return fh.loadJsonFile(`${patcherUrl}/config/${name}.json`);
};

registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'Cell Encounter Levels In Name',
        templateUrl: `${patcherUrl}/partials/settings.html`,
        defaultSettings: {
            formulaRangedLeveled: '{name} [{min} ~ {max}]',
            formulaDeleveled: '{name} [{min}]',
            formulaLeveled: '{name} [{min}+]',
            patchFileName: 'PatchusMaximus.esp'
        }
    },
    requiredFiles: ['PerkusMaximus_Master.esp'],
    execute: {
        initialize: function(patch, helpers, settings, locals) {
            locals.gameSettings = loadConfig('game-settings');
            locals.enchantingConfig = loadConfig('enchanting');
            locals.weaponMaterials = loadConfig('weapon-materials');
            locals.armorMaterials = loadConfig('armor-materials');
            locals.npcExclusions = loadConfig('npc-exclusions');

            locals.CRAFTING_FORM_IDS = createCraftingFormIDs();
            locals.MATERIALS = createMaterials(locals.CRAFTING_FORM_IDS);
        },
        process: [
            gameSettingsPatcher(), 
            cobjPatcher()//,
            //mgefPatcher(),
            //npcPatcher()
        ]
    }
});