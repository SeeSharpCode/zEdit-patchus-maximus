/* global ngapp, xelib */
let patchers = [];

let staffRecipeExclusions = ['ACX', 'Unenchanted'];

function getWorkBenchEditorID(record) {
    return xelib.EditorID(xelib.GetLinksTo(record, 'BNAM'));
}

function isStaffEnchanter(editorID) {
    return editorID === 'DLC2StaffEnchanter';
}

function isSharpeningWheel(editorID) {
    return editorID === 'CraftingSmithingSharpeningWheel';
}

patchers.push({
    load: function (plugin, helpers, settings, locals) {
        return {
            signature: 'COBJ',
            filter: function (record) {
                let workBenchEditorID = getWorkBenchEditorID(record);
                return isStaffEnchanter(workBenchEditorID) || isSharpeningWheel(workBenchEditorID);
            }
        }
    },
    patch: function (record, helpers, settings, locals) {
        let editorID = xelib.EditorID(record);
        // helpers.logMessage(`Patching ${editorID}!`);

        let workBenchEditorID = getWorkBenchEditorID(record);
        if (isStaffEnchanter(workBenchEditorID)) {
            let craftingOutputEditorID = xelib.EditorID(xelib.GetLinksTo(record, 'CNAM'));
            helpers.logMessage(`Crafting output: ${craftingOutputEditorID}`);
            let shouldDisable = false;
            staffRecipeExclusions.forEach(exclusion => {
                if (craftingOutputEditorID.includes(exclusion)) {
                    shouldDisable = true;
                }
            });

            if (shouldDisable) {
                helpers.logMessage(`Disabling ${editorID}`);
                //xelib.Set
            }
        }
    }
});
const gameSettings = {
    fArmorScalingFactor: .1,
    fMaxArmorRating: 90.0,
    fArmorRatingMax: 1.75,
    fArmorRatingPCMax: 1.4
};

let gameSettingsKeys = Object.keys(gameSettings);

// TODO: if useWarrior
patchers.push({
    load: function (plugin, helpers, settings, locals) {
        return {
            signature: 'GMST',
            filter: function (record) {
                let editorId = xelib.EditorID(record);
                return gameSettingsKeys.indexOf(editorId) > -1;
            }
        }
    },
    patch: function (record, helpers, settings, locals) {
        let editorId = xelib.EditorID(record);
        let value = gameSettings[editorId];
        helpers.logMessage(`Setting ${editorId} to ${value}`);
        xelib.SetFloatValue(record, 'DATA\\Float', value);
    }
});

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
    getFilesToPatch: function (filenames) {
        return filenames;
    },
    execute: {
        process: patchers
    }
});