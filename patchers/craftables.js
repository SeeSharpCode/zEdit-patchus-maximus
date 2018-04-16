function getWorkBenchEditorID(record) {
    return xelib.EditorID(xelib.GetLinksTo(record, 'BNAM'));
}

function isStaffEnchanter(editorID) {
    return editorID === 'DLC2StaffEnchanter';
}

function isSharpeningWheel(editorID) {
    return editorID === 'CraftingSmithingSharpeningWheel';
}

function diableStaffRecipes(record, locals, craftingOutputEditorID) {
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

function getTemperingMaterial() {
    
}

function changeTemperingPerkRequirement(locals, craftingOutputRecord) {
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
        helpers.logMessage(`Found temper material ${matchingWeaponMaterialTemper} for ${outputWeaponName}`)

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
            disableStaffRecipes(record, locals, craftingOutputEditorID);
        } else if (isSharpeningWheel(workBenchEditorID)) {
            changeTemperingPerkRequirement(locals, craftingOutputRecord);
        }
    }
});