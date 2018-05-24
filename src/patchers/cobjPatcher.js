//=require ../records/recipe.js

const cobjPatcher = function () {
    const shouldDisableStaffRecipe = function(staffCraftingDisableExclusions, outputRecordEditorID) {
        return !!staffCraftingDisableExclusions.find(exclusion => {
            return outputRecordEditorID.includes(exclusion);
        });
    };

    const changeRecipeConditions = function (recipe, equipmentMaterials, materials, helpers) {
        xelib.RemoveElement(recipe.record, 'Conditions');

        const smithingPerkFormID = getSmithingPerkFormID(recipe, equipmentMaterials, materials, helpers);
        if (!smithingPerkFormID) {
            return;
        }

        // TODO: hacky workaround to add condition until xelib is fixed
        xelib.AddElement(recipe.record, 'Conditions');
        // TODO: is this Type correct? looks like Not Equal To
        const condition = xelib.AddCondition(recipe.record, 'HasPerk', '10000000', '1');
        xelib.SetValue(condition, 'CTDA\\Parameter #1', smithingPerkFormID);
        xelib.RemoveCondition(recipe.record, 'GetWantBlocking');
    }

    const getSmithingPerkFormID = function (recipe, equipmentMaterials, materials, helpers) {
        const materialName = getMaterialName(recipe.outputRecordName, equipmentMaterials, helpers);
        if (!materialName) {
            helpers.logMessage(`(COBJ) WARNING: no material found for ${recipe.outputRecordName}. ${recipe.editorID} recipe will not be patched.`);
            return null;
        }

        const material = materials.find(m => m.name === materialName);
        if (!material) {
            helpers.logMessage(`(COBJ) WARNING: no material found with name ${materialName}. ${recipe.EditorID} recipe will not be patched.`);
            return null;
        }

        return material.smithingPerkFormID;
    }

    const getMaterialName = function (outputName, equipmentMaterials, helpers) {
        let materialName = null;
        let matchLength = 0;

        equipmentMaterials.forEach(m => {
            m.nameSubstrings.forEach(substring => {
                if (outputName.includes(substring) && substring.length > matchLength) {
                    materialName = m.material;
                    matchLength = substring.length;
                }
            });
        });

        return materialName;
    }

    return {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'COBJ',
                filter: function (record) {
                    const craftingStationFormIDs = locals.CRAFTING_FORM_IDS.CRAFTING_STATIONS;
                    const patchableWorkbenches = [craftingStationFormIDs.STAFF_ENCHANTER, craftingStationFormIDs.SHARPENING_WHEEL, craftingStationFormIDs.ARMOR_TABLE];
                    const recipe = new Recipe(record, craftingStationFormIDs);
                    if (!patchableWorkbenches.includes(recipe.workbenchFormID)) {
                        return false;
                    }
                    if (!recipe.outputRecord) {
                        helpers.logMessage(`(COBJ) WARNING: ${recipe.editorID} has no output and will not be patched.`);
                        return false;
                    }
                    return true;
                }
            }
        },
        patch: function (record, helpers, settings, locals) {
            const recipe = new Recipe(record, locals.CRAFTING_FORM_IDS.CRAFTING_STATIONS);

            // TODO: if useMage
            if (recipe.isStaffRecipe && shouldDisableStaffRecipe(locals.enchantingConfig.staffCraftingDisableExclusions, recipe.outputRecordEditorID)) {
                helpers.logMessage(`(COBJ) disabling staff recipe: ${recipe.editorID}`);
                // TODO: verify this works, probably doesn't
                xelib.SetUIntValue(record, 'BNAM', 0x00013794);
            } else if (recipe.isWeaponRecipe || recipe.isArmornRecipe) {
                // TODO: if useWarrior
                const equipmentMaterials = recipe.isWeaponRecipe ? locals.weaponMaterials : locals.armorMaterials;
                changeRecipeConditions(recipe, equipmentMaterials, locals.MATERIALS, helpers);
            }
        }
    };
}