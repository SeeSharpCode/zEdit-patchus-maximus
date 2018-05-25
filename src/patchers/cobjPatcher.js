//=require ../records/recipe.js

const cobjPatcher = function(helpers, settings, locals) {
    const warn = msg => helpers.logMessage(`(COBJ) WARNING: ${msg}`);
    const skip = (recipe, msg) => {
        warn(`${msg}. ${recipe.editorID} will not be patched.`);
    };

    const getEquipmentMaterials = function(recipe) {
        return recipe.isWeaponRecipe ? locals.weaponMaterials : locals.armorMaterials;
    };

    const getMaterialName = function(recipe) {
        let outputName = recipe.outputRecordName,
            materialName = null,
            matchLength = 0;

        getEquipmentMaterials(recipe).forEach(m => {
            m.nameSubstrings.forEach(substring => {
                let subLen = substring.length;
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

        return material.smithingPerkFormID;
    };

    const changeRecipeConditions = function(recipe) {
        if (!locals.useWarrior) return;
        xelib.RemoveElement(recipe.record, 'Conditions');

        const smithingPerkFormID = getSmithingPerkFormID(recipe);
        if (!smithingPerkFormID) return;

        // TODO: is this Type correct? looks like Not Equal To
        const condition = xelib.AddCondition(recipe.record, 'HasPerk', '10000000', '1');
        xelib.SetValue(condition, 'CTDA\\Parameter #1', smithingPerkFormID);
    };

    const shouldDisableStaffRecipe = function(recipe) {
        if (!locals.useMage) return;
        return !!settings.staffCraftingInclusions.find(exclusion => {
            return recipe.outputRecordEditorID.includes(exclusion);
        });
    };

    const handleWorkBench = {
        'DLC2StaffEnchanter': function(recipe) {
            if (!shouldDisableStaffRecipe(recipe)) return;
            helpers.logMessage(`(COBJ) disabling staff recipe: ${recipe.editorID}`);
            xelib.SetUIntValue(recipe.record, 'BNAM', 0);
        },
        'CraftingSmithingSharpeningWheel': changeRecipeConditions,
        'CraftingSmithingArmorTable': changeRecipeConditions
    };

    const cobjFilter = function(record) {
        let workbench = xelib.GetRefEditorID(record, 'BNAM');
        if (!handleWorkBench.hasOwnProperty(workbench)) return;
        if (!xelib.GetLinksTo(record, 'CNAM'))
            return warn(`${xelib.EditorID(record)} has no output and will not be patched.`);
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