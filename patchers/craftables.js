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
            disableStaffRecipes(record, locals.enchantingConfig, craftingOutputEditorID);
        } else if (isSharpeningWheel(workBenchEditorID)) {
            changeRecipeConditions(record, locals.weaponMaterials, craftingOutputRecord, helpers);
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

function disableStaffRecipes(record, enchantingConfig, craftingOutputEditorID) {
    let shouldDisable = false;
    enchantingConfig.staffCraftingDisableExclusions.forEach(exclusion => {
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

function changeRecipeConditions(record, weaponMaterials, craftingOutputRecord, helpers) {
    // TODO: should conditions only be removed if a tempering perk is found?
    // TODO: first check if we have the element
    helpers.logMessage(`Removing conditions for ${xelib.EditorID(record)}`);
    xelib.RemoveElement(record, "Conditions");

    let outputWeaponName = xelib.Name(craftingOutputRecord);
    let temperingPerkFormID = getTemperingPerkFormID(weaponMaterials, outputWeaponName);
    if (temperingPerkFormID) {    
        xelib.AddElement(record, "Conditions"); 
        helpers.logMessage(`Adding condition to ${xelib.EditorID(record)}: ${temperingPerkFormID}`);
        xelib.AddCondition(record, "HasPerk", "10000000", "1", temperingPerkFormID);
    }
}

function getTemperingPerkFormID(weaponMaterials, outputWeaponName) {
    let matchLength = 0;
    let temperingPerkFormID = "";
    weaponMaterials.forEach(weaponMaterial => {
        weaponMaterial.nameSubstrings.forEach(substring => {
            if (outputWeaponName.includes(substring) && substring.length > matchLength) {
                temperingPerkFormID = weaponMaterial.temperingPerkFormID;
                matchLength = substring.length;
            }
        });
    });
    return temperingPerkFormID;    
}