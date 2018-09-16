import Recipe from '../records/recipe';

export default function cobjPatcher(helpers, locals) {
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

    const getSmithingPerkEditorID = function(recipe) {
        const materialName = getMaterialName(recipe);
        if (!materialName) {
            return skip(recipe, `no material found for ${recipe.outputRecordName}.`);
        }

        const material = locals.recipeMaterials[materialName];
        if (!material) {
            return skip(recipe, `no material found with name ${materialName}.`);
        }

        return material.smithingPerk;
    };

    const changeRecipeConditions = function(recipe) {
        if (!locals.useWarrior) return;
        xelib.RemoveElement(recipe.record, 'Conditions');
        log(`removed all conditions for ${recipe.editorID}`);

        const smithingPerkEditorID = getSmithingPerkEditorID(recipe);
        if (!smithingPerkEditorID) return;
        const smithingPerkFormID = locals.PERK[smithingPerkEditorID];
        xelib.AddCondition(recipe.record, 'HasPerk', locals.conditionTypes.EqualTo, '1', smithingPerkFormID);
        log(`added HasPerk (${smithingPerkEditorID}) condition to ${recipe.editorID} recipe`);
    };

    // TODO this doesn't seem to pick up any records
    const shouldDisableStaffRecipe = function(recipe) {
        if (!locals.useMage) return false;
        // TODO make this exclusion list a setting
        return recipe.outputRecordEditorID.includes('ACX') || recipe.outputRecordEditorID.includes('Unenchanted');
    };

    const handleWorkbench = {
        DLC2StaffEnchanter: recipe => {
            if (!shouldDisableStaffRecipe(recipe)) return;
            xelib.SetUIntValue(recipe.record, 'BNAM', locals.KYWD.ActorTypeNPC);
            log(`disabled staff recipe: ${recipe.editorID}`);
        },
        CraftingSmithingSharpeningWheel: changeRecipeConditions,
        CraftingSmithingArmorTable: changeRecipeConditions
    };

    const cobjFilter = function(record) {
        const workbench = xelib.GetRefEditorID(record, 'BNAM');
        // TODO verify this works
        if (!Object.keys(handleWorkbench).includes(workbench)) return false;
        // TODO GetWinningOverride?
        if (!xelib.GetLinksTo(record, 'CNAM')) {
            log(`${xelib.EditorID(record)} has no output and will not be patched.`);
            return false;
        }
        return true;
    };

    return {
        load: {
            signature: 'COBJ',
            filter: cobjFilter
        },
        patch: record => {
            const recipe = new Recipe(record);
            handleWorkbench[recipe.workbench](recipe);
        }
    };
}
