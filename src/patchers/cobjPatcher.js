//=require ../records/recipe.js

const cobjPatcher = function(helpers, settings, locals) {
    const log = message => helpers.logMessage(`(COBJ) ${message}`);
    const skip = (recipe, message) => {
        log(`${message}. ${recipe.editorID} will not be patched.`);
    };

    const getEquipmentMaterials = function(recipe) {
        return recipe.isWeaponRecipe ? locals.weaponMaterials : locals.armorMaterials;
    };

    const getMaterialName = function(recipe) {
        const outputName = recipe.outputRecordName;
        let materialName = null;
        let matchLength = 0;

        getEquipmentMaterials(recipe).forEach(m => {
            m.nameSubstrings.forEach(substring => {
                const subLen = substring.length;
                if (outputName.includes(substring) && subLen > matchLength) {
                    materialName = m.material;
                    matchLength = subLen;
                }
            });
        });

        return materialName;
    };

    const getSmithingPerkFormID = function(recipe) {
        const materialName = getMaterialName(recipe);
        if (!materialName)
            return skip(recipe, `no material found for ${recipe.outputRecordName}.`);

        const material = locals.recipeMaterials[materialName];
        if (!material)
            return skip(recipe, `no material found with name ${materialName}.`);

        if (!material.smithingPerk) return;
        return locals.PERK[material.smithingPerk];
    };

    const changeRecipeConditions = function(recipe) {
        if (!locals.useWarrior) return;
        xelib.RemoveElement(recipe.record, 'Conditions');

        const smithingPerkFormID = getSmithingPerkFormID(recipe);
        if (!smithingPerkFormID) return;
        xelib.AddCondition(recipe.record, 'HasPerk', locals.conditionTypes.EqualTo, '1', smithingPerkFormID);
    };

    const shouldDisableStaffRecipe = function(recipe) {
        if (!locals.useMage) return;
        // TODO make this exclusion list a setting
        return recipe.outputRecordEditorID.includes('ACX') || recipe.outputRecordEditorID.includes('Unenchanted');
    };

    const handleWorkbench = {
        'DLC2StaffEnchanter': function(recipe) {
            if (!shouldDisableStaffRecipe(recipe)) return;
            log(`disabling staff recipe: ${recipe.editorID}`);
            xelib.SetUIntValue(recipe.record, 'BNAM', locals.KYWD.ActorTypeNPC);
        },
        'CraftingSmithingSharpeningWheel': changeRecipeConditions,
        'CraftingSmithingArmorTable': changeRecipeConditions
    };

    const cobjFilter = function(record) {
        const workbench = xelib.GetRefEditorID(record, 'BNAM');
        if (!handleWorkbench.hasOwnProperty(workbench)) return;
        if (!xelib.GetLinksTo(record, 'CNAM'))
            return log(`${xelib.EditorID(record)} has no output and will not be patched.`);
        return true;
    };

    return {
        load: {
            signature: 'COBJ',
            filter: cobjFilter
        },
        patch: function(record) {
            const recipe = new Recipe(record);
            handleWorkbench[recipe.workbench](recipe);
        }
    };
};