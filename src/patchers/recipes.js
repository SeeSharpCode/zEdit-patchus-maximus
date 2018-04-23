class Recipe {
    constructor(record, helpers) {
        this.record = record;
        this.editorID = xelib.EditorID(record);
        this.workbenchEditorID = xelib.EditorID(xelib.GetLinksTo(record, 'BNAM'));
        this.outputRecord = xelib.GetLinksTo(record, 'CNAM');
        if (this.outputRecord) {
            this.outputRecordEditorID = xelib.EditorID(this.outputRecord);
            this.outputRecordName = xelib.Name(this.outputRecord);
        }
        this.helpers = helpers;
    }

    get isStaffRecipe() {
        return this.workbenchEditorID === CRAFTING_STATIONS.STAFF_ENCHANTER_EDITOR_ID;
    }

    get isWeaponRecipe() {
        return this.workbenchEditorID === CRAFTING_STATIONS.SHARPENING_WHEEL_EDITOR_ID;
    }

    get isArmorRecipe() {
        return this.workbenchEditorID === CRAFTING_STATIONS.ARMOR_TABLE_EDITOR_ID;
    }

    get hasOutput() {
        if (!this.outputRecord) {
            helpers.logMessage(`WARNING: No output record for ${this.editorID}. Recipe will not be patched.`);
            return false;
        }
        return true;
    }
}

patchers.push({
    load: function (plugin, helpers, settings, locals) {
        return {
            signature: 'COBJ',
            filter: function (record) {
                let recipe = new Recipe(record, helpers);
                return (recipe.isStaffRecipe || recipe.isWeaponRecipe || recipe.isArmorRecipe) && recipe.hasOutput;
            }
        }
    },
    patch: function (record, helpers, settings, locals) {
        let recipe = new Recipe(record, helpers);

        // TODO: if useMage
        if (recipe.isStaffRecipe()) {
            if (shouldDisableStaffRecipe(locals.enchantingConfig.staffCraftingDisableExclusions, recipe.outputRecordEditorID)) {
                helpers.logMessage(`Disabling staff recipe: ${recipe.editorID}`);
                // TODO: verify this works, probably doesn't
                xelib.SetUIntValue(record, 'BNAM', 0x00013794);
            }
        } else {
            // TODO: if useWarrior
            let materials = (recipe.workbenchEditorID === CRAFTING_STATIONS.SHARPENING_WHEEL_EDITOR_ID) ? locals.weaponMaterials : locals.armorMaterials;
            changeRecipeConditions(recipe, materials);
        }
    }
});

function shouldDisableStaffRecipe(staffCraftingDisableExclusions, outputRecordEditorID) {
    // TODO: reevaluate this logic, seems funky
    let shouldDisable = false;
    staffCraftingDisableExclusions.forEach(exclusion => {
        if (outputRecordEditorID.includes(exclusion)) {
            return true;
        }
    });
    return false;
}

function changeRecipeConditions(recipe, materials) {
    helpers.logMessage(`Removing conditions for ${recipe.editorID}`);
    xelib.RemoveElement(recipe.record, 'Conditions');

    let smithingPerkFormID = getSmithingPerkFormID(recipe.record, outputName, helpers);
    if (smithingPerkFormID) {
        xelib.AddElement(record, 'Conditions');
        let condition = xelib.AddCondition(record, 'HasPerk', '10000000', '1');
        xelib.SetValue(condition, 'CTDA\\Parameter #1', smithingPerkFormID);
        xelib.RemoveCondition(record, 'GetWantBlocking');
    }
}

function getSmithingPerkFormID(record, outputName, helpers) {

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