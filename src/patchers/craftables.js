const STAFF_ENCHANTER_EDITORID = 'DLC2StaffEnchanter';
const SHARPENING_WHEEL_EDITORID = 'CraftingSmithingSharpeningWheel';
const ARMOR_WORKBENCH_EDITORID = 'CraftingSmithingArmorTable';
const PATCHABLE_CRAFTING_STATIONS = [STAFF_ENCHANTER_EDITORID, SHARPENING_WHEEL_EDITORID, ARMOR_WORKBENCH_EDITORID];

patchers.push({
    load: function (plugin, helpers, settings, locals) {
        return {
            signature: 'COBJ',
            filter: function (record) {
                debugger;
                let workBenchEditorID = getWorkBenchEditorID(record);
                return PATCHABLE_CRAFTING_STATIONS.includes(workBenchEditorID);
            }
        }
    },
    patch: function (record, helpers, settings, locals) {
        let editorID = xelib.EditorID(record);
        let craftingOutputRecord = xelib.GetLinksTo(record, 'CNAM');

        if (!craftingOutputRecord) {
            helpers.logMessage(`WARNING: No output record for ${editorID}. Recipe will not be patched.`);
            return;
        }

        let craftingOutputEditorID = xelib.EditorID(craftingOutputRecord);
        let workBenchEditorID = getWorkBenchEditorID(record);
        let outputName = xelib.Name(craftingOutputRecord);

        // TODO: if useMage
        if (craftingOutputEditorID === STAFF_ENCHANTER_EDITORID) {
            if (shouldDisableStaffRecipe(locals.enchantingConfig.staffCraftingDisableExclusions, craftingOutputEditorID)) {
                helpers.logMessage(`Disabling staff recipe: ${editorID}`);
                // TODO: verify this works, probably doesn't
                xelib.SetUIntValue(record, 'BNAM', 0x00013794);
            }
        } else {
            // TODO: if useWarrior
            let materials = (workBenchEditorID === SHARPENING_WHEEL_EDITORID) ? locals.weaponMaterials : locals.armorMaterials;

            changeRecipeConditions(record, materials, outputName, helpers);
        }
    }
});

function getWorkBenchEditorID(record) {
    return xelib.EditorID(xelib.GetLinksTo(record, 'BNAM'));
}

function shouldDisableStaffRecipe(staffCraftingDisableExclusions, craftingOutputEditorID) {
    let shouldDisable = false;
    staffCraftingDisableExclusions.forEach(exclusion => {
        if (craftingOutputEditorID.includes(exclusion)) {
            return true;
        }
    });
    return false;
}

function changeRecipeConditions(record, materials, outputName, helpers) {
    let recipeEditorID = xelib.EditorID(record);

    helpers.logMessage(`Removing conditions for ${recipeEditorID}`);
    xelib.RemoveElement(record, 'Conditions');

    let materialName = getMaterialName(outputName, materials, helpers);
    if (!materialName) {
        helpers.logMessage(`WARNING: No material name found for ${outputName}. ${recipeEditorID} recipe will not be patched.`);
        return;
    }

    let material = MATERIALS.find(m => m.name === materialName);
    if (!material) {
        helpers.logMessage(`WARNING: No material found with name ${materialName}. ${recipeEditorID} recipe will not be patched.`);
        return;
    }

    let smithingPerkFormID = material.smithingPerkFormID;

    if (!smithingPerkFormID) {
        return;
    }

    xelib.AddElement(record, 'Conditions');
    let condition = xelib.AddCondition(record, 'HasPerk', '10000000', '1');
    xelib.SetValue(condition, 'CTDA\\Parameter #1', smithingPerkFormID);
    xelib.RemoveCondition(record, 'GetWantBlocking');
}

function getMaterialName(outputName, materials, helpers) {
    let matchLength = 0;
    let materialName = null;

    materials.forEach(m => {
        m.nameSubstrings.forEach(substring => {
            if (outputName.includes(substring) && substring.length > matchLength) {
                materialName = m.material;
                matchLength = substring.length;
            }
        });
    });

    return materialName;
}