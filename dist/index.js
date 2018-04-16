/* global ngapp, xelib */
let patchers = [];

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

        let craftingOutputRecord = xelib.GetLinksTo(record, 'CNAM');

        let craftingOutputEditorID = xelib.EditorID(craftingOutputRecord);

        let workBenchEditorID = getWorkBenchEditorID(record);



        if (isStaffEnchanter(workBenchEditorID)) {

            let shouldDisable = false;

            locals.enchantingConfig.staffCraftingDisableExclusions.forEach(exclusion => {

                if (craftingOutputEditorID.includes(exclusion)) {

                    shouldDisable = true;

                }

            });



            if (shouldDisable) {

                helpers.logMessage(`Disabling ${editorID}`);

                // TODO: verify this works

                xelib.SetUIntValue(record, 'BNAM', 0x013794);

            }

        }



        if (isSharpeningWheel(workBenchEditorID)) {

            let outputWeaponName = xelib.Name(craftingOutputRecord);

            let matchLength = 0;

            let matchingWeaponMaterialTemper = "";

            locals.weapons.forEach(weapon => {

                weapon.matchingNameParts.forEach(namePart => {

                    if (outputWeaponName.includes(namePart) && namePart.length > matchLength) {

                        matchingWeaponMaterialTemper = weapon.material.temper;

                        matchLength = namePart.length;

                    }

                });

            });

            if (matchingWeaponMaterialTemper) {

                helpers.logMessage(`Matched ${outputWeaponName} to ${matchingWeaponMaterialTemper}`)

            }

        }

    }

});


// TODO: if useWarrior

patchers.push({

    load: function (plugin, helpers, settings, locals) {

        return {

            signature: 'GMST',

            filter: function (record) {

                let editorID = xelib.EditorID(record);

                return Object.keys(locals.gameSettings).indexOf(editorID) > -1;

            }

        }

    },

    patch: function (record, helpers, settings, locals) {

        let editorID = xelib.EditorID(record);

        let value = locals.gameSettings[editorID];

        helpers.logMessage(`Setting ${editorID} to ${value}`);

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
        initialize: function(patch, helpers, settings, locals) {
            locals.gameSettings = fh.loadJsonFile(`${fh.fileUrlToPath(patcherPath)}/config/game-settings.json`);
            locals.enchantingConfig = fh.loadJsonFile(`${fh.fileUrlToPath(patcherPath)}/config/enchanting.json`);
            locals.weapons = fh.loadJsonFile(`${fh.fileUrlToPath(patcherPath)}/config/weapons.json`);
        },
        process: patchers
    }
});