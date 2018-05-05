/* global ngapp, xelib */
//=require src/patchers/*.js
//=require src/crafting.js

const getLoadOrder = function(fileName) {
    const loadOrder = xelib.GetFileLoadOrder(xelib.FileByName(fileName)).toString(16);
    return loadOrder.length === 2 ? loadOrder : `0${loadOrder}`;
};

registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'Cell Encounter Levels In Name',
        templateUrl: `${patcherPath}/partials/settings.html`,
        defaultSettings: {
            formulaRangedLeveled: '{name} [{min} ~ {max}]',
            formulaDeleveled: '{name} [{min}]',
            formulaLeveled: '{name} [{min}+]',
            patchFileName: 'PatchusMaximus.esp'
        }
    },
    requiredFiles: [],
    getFilesToPatch: function(filenames) {
        return filenames;
    },
    execute: {
        initialize: function(patch, helpers, settings, locals) {
            locals.gameSettings = fh.loadJsonFile(`${fh.fileUrlToPath(patcherPath)}/config/game-settings.json`);
            locals.enchantingConfig = fh.loadJsonFile(`${fh.fileUrlToPath(patcherPath)}/config/enchanting.json`);
            locals.weaponMaterials = fh.loadJsonFile(`${fh.fileUrlToPath(patcherPath)}/config/weapon-materials.json`);
            locals.armorMaterials = fh.loadJsonFile(`${fh.fileUrlToPath(patcherPath)}/config/armor-materials.json`);
            locals.npcExclusions = fh.loadJsonFile(`${fh.fileUrlToPath(patcherPath)}/config/npc-exclusions.json`);
        
            const dragonbornLoadOrder = getLoadOrder('Dragonborn.esm');
            const perMaMasterLoadOrder = getLoadOrder('PerkusMaximus_Master.esp');

            const craftingFormIDs = createCraftingFormIDs(dragonbornLoadOrder, perMaMasterLoadOrder);
            locals.CRAFTING_FORM_IDS = craftingFormIDs;
            locals.MATERIALS = createMaterials(craftingFormIDs);
        },
        process: [
            gameSettingsPatcher(), 
            cobjPatcher()//,
            //mgefPatcher(),
            //npcPatcher()
        ]
    }
});