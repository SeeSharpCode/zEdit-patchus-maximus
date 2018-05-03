/* global ngapp, xelib */
//=require src/patchers/*.js
//=require src/craftingConstants.js

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

            const perMaMasterOrdinal = xelib.GetFileLoadOrder(xelib.FileByName('PerkusMaximus_Master.esp'));
            locals.CRAFTING_CONSTANTS = createCraftingConstants(perMaMasterOrdinal);
        },
        process: [
            gameSettingsPatcher()//, 
            //cobjPatcher()
        ]
    }
});