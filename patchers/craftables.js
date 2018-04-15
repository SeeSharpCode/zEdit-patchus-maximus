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
        let craftingOutputEditorID = xelib.EditorID(xelib.GetLinksTo(record, 'CNAM'));
        let workBenchEditorID = getWorkBenchEditorID(record);
        // helpers.logMessage(`Patching ${editorID}!`);

        if (isStaffEnchanter(workBenchEditorID)) {
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

        if (isSharpeningWheel(workBenchEditorID)) {
            
        }
    }
});