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

function getTemperingMaterial(weaponMaterials, outputWeaponName) {
    let matchLength = 0;
    let temperingMaterial = "";
    weaponMaterials.forEach(weaponMaterial => {
        weaponMaterial.matchingNameParts.forEach(namePart => {
            if (outputWeaponName.includes(namePart) && namePart.length > matchLength) {
                temperingMaterial = weaponMaterial.temper;
                matchLength = namePart.length;
            }
        });
    });
    return temperingMaterial;    
}

function changeTemperingPerkRequirement(weaponMaterials, craftingOutputRecord, helpers) {
    let outputWeaponName = xelib.Name(craftingOutputRecord);
    let matchingMaterialTemper = getTemperingMaterial(weaponMaterials, outputWeaponName);
    if (matchingMaterialTemper) {
        helpers.logMessage(`Found temper material ${matchingMaterialTemper} for ${outputWeaponName}`);
    }
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
            disableStaffRecipes(record, locals.enchantingConfig, craftingOutputEditorID);
        } else if (isSharpeningWheel(workBenchEditorID)) {
            changeTemperingPerkRequirement(locals.weaponMaterials, craftingOutputRecord, helpers);
        }
    }
});