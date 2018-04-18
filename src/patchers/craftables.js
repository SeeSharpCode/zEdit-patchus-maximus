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

        // TODO: if useMage
        if (isStaffEnchanter(workBenchEditorID) && shouldDisableStaffRecipe(locals.enchantingConfig.staffCraftingDisableExclusions, craftingOutputEditorID)) {
            helpers.logMessage(`Disabling staff recipe: ${editorID}`);
            // TODO: verify this works, probably doesn't
            xelib.SetUIntValue(record, 'BNAM', 0x00013794);
        } else if (isSharpeningWheel(workBenchEditorID) && craftingOutputRecord) { // TODO if useWarrior
            changeRecipeConditions(record, locals.weaponMaterials, xelib.Name(craftingOutputRecord), helpers);
        }
    }
});

function getWorkBenchEditorID(record) {
    return xelib.EditorID(xelib.GetLinksTo(record, 'BNAM'));
}

function isStaffEnchanter(editorID) {
    return editorID === 'DLC2StaffEnchanter';
}

function isSharpeningWheel(editorID) {
    return editorID === 'CraftingSmithingSharpeningWheel';
}

function shouldDisableStaffRecipe(staffCraftingDisableExclusions, craftingOutputEditorID) {
    let shouldDisable = false;
    enchantingConfig.staffCraftingDisableExclusions.forEach(exclusion => {
        if (craftingOutputEditorID.includes(exclusion)) {
            return true;
        }
    });
    return false;
}

function changeRecipeConditions(record, weaponMaterials, outputWeaponName, helpers) {
    let recipeEditorID = xelib.EditorID(record);

    helpers.logMessage(`Removing conditions for ${recipeEditorID}`);
    xelib.RemoveElement(record, "Conditions");

    let weaponMaterialName = getWeaponMaterialName(outputWeaponName, weaponMaterials);
    if (!weaponMaterialName) {
        helpers.logMessage(`WARNING: No material name found for ${outputWeaponName}. ${recipeEditorID} recipe will not be patched.`);
        return;
    }

    let material = MATERIALS.find(m => m.name === weaponMaterialName);
    if (!material) {
        helpers.logMessage(`WARNING: No material found with name ${weaponMaterialName}. ${recipeEditorID} recipe will not be patched.`);
        return;
    }

    let smithingPerkFormID = material.smithingPerkFormID;

    helpers.logMessage(`Adding required perk ${smithingPerkFormID} to ${recipeEditorID}`);
    xelib.AddElement(record, "Conditions");
    xelib.AddCondition(record, "HasPerk", "10000000", "1", smithingPerkFormID);
}

function getWeaponMaterialName(outputWeaponName, weaponMaterials) {
    let matchLength = 0;
    let weaponMaterialName = null;
    weaponMaterials.forEach(m => {
        m.nameSubstrings.forEach(substring => {
            if (outputWeaponName.includes(substring) && substring.length > matchLength) {
                weaponMaterialName = m.name;
                matchLength = substring.length;
            }
        });
    });
    return weaponMaterialName;
}