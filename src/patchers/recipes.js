const PATCHABLE_WORKBENCHES = [
    CRAFTING_STATIONS.STAFF_ENCHANTER_EDITOR_ID, 
    CRAFTING_STATIONS.SHARPENING_WHEEL_EDITOR_ID, 
    CRAFTING_STATIONS.ARMOR_TABLE_EDITOR_ID
];

class Recipe {
    constructor(record, helpers) {
        this.record = record;
        this.editorID = xelib.EditorID(record);
        this.workbenchEditorID = xelib.EditorID(xelib.GetLinksTo(record, 'BNAM'));
        this.outputRecord = xelib.GetLinksTo(record, 'CNAM');
        this.outputRecordEditorID = xelib.EditorID(this.outputRecord);
    }

    get isStaffRecipe() {
        return this.workbenchEditorID === CRAFTING_STATIONS.STAFF_ENCHANTER_EDITOR_ID;
    }
}

patchers.push({
    load: function (plugin, helpers, settings, locals) {
        return {
            signature: 'COBJ',
            filter: function (record) {
                let recipe = new Recipe(record);
                if (!PATCHABLE_WORKBENCHES.includes(recipe.workbenchEditorID)) {
                    return false;
                }
                if (!recipe.outputRecord) {
                    helpers.logMessage(`WARNING: No output record for ${recipe.editorID}. Recipe will not be patched.`);
                    return false;
                }
                return true;
            }
        }
    },
    patch: function (record, helpers, settings, locals) {
        let recipe = new Recipe(record, helpers);

        // TODO: if useMage
        if (recipe.isStaffRecipe()) {
            // TODO: reevaluate this logic, seems funky
            if (shouldDisableStaffRecipe(locals.enchantingConfig.staffCraftingDisableExclusions, recipe.outputRecordEditorID)) {
                helpers.logMessage(`Disabling staff recipe: ${xelib.EditorID(record)}`);
                // TODO: verify this works, probably doesn't
                xelib.SetUIntValue(record, 'BNAM', 0x00013794);
            }
        } else {
            // TODO: if useWarrior
            let outputName = xelib.Name(craftingOutputRecord);
            let materials = (workbenchEditorID === SHARPENING_WHEEL_EDITORID) ? locals.weaponMaterials : locals.armorMaterials;
            changeRecipeConditions(record, materials, outputName, helpers);
        }
    }
});

function shouldDisableStaffRecipe(staffCraftingDisableExclusions, craftingOutputEditorID) {
    let shouldDisable = false;
    staffCraftingDisableExclusions.forEach(exclusion => {
        if (craftingOutputEditorID.includes(exclusion)) {
            return true;
        }
    });
    return false;
}

function changeRecipeConditions(record, materials) {
    let recipeEditorID = 
    helpers.logMessage(`Removing conditions for ${xelib.EditorID(record)}`);
    xelib.RemoveElement(record, 'Conditions');

    let materials = (getWorkBenchEditorID(record) === SHARPENING_WHEEL_EDITORID) ? locals.weaponMaterials : locals.armorMaterials;
    let smithingPerkFormID = getSmithingPerkFormID(record, outputName, helpers);
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