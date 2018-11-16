import Recipe from '../model/recipe';

export default function cobjPatcher(helpers, locals, configService) {
    const log = message => helpers.logMessage(`(COBJ) ${message}`);
    const skip = (recipe, message) => {
        log(`${message}. ${recipe.editorID} will not be patched.`);
    };

    const getMaterialType = function(recipe) {
        const outputName = recipe.outputRecordName;
        const material = recipe.isWeaponRecipe ? configService.getWeaponMaterial(outputName) : configService.getArmorMaterial(outputName);
        return material == null ? null : material.type;
    };

    const getSmithingPerkEditorID = function(recipe) {
        const materialType = getMaterialType(recipe);
        if (!materialType) {
            return skip(recipe, `no material type found for ${recipe.outputRecordName}.`);
        }

        const material = configService.getRecipeMaterial(materialType);
        if (!material) {
            return skip(recipe, `no material found with type ${materialType}.`);
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
