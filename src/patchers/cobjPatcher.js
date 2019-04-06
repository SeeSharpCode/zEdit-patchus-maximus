import Recipe from '../model/recipe';
import conditionOperators from '../model/conditionOperators';
import materials from '../../config/materials.json';

export default function cobjPatcher(helpers, locals, settings) {
  const log = message => helpers.logMessage(`(COBJ) ${message}`);
  const skip = (recipe, message) => {
    log(`${message} ${recipe.editorID} will not be patched.`);
  };

  const isTemperRecipe = recipe => recipe.editorID.startsWith('Temper') && xelib.HasElement(recipe.record, 'Items');

  // TODO reconsider. For example, Daedric equipment requires ebony ingots.
  // Maybe key off of the required perk for the corresponding crafting recipe?
  // Potential issue: what if the patcher has (or hasn't) changed the conditions on the crafting recipe?
  const getTemperMaterial = recipe => {
    const item = xelib.GetElements(recipe.record, 'Items')[0];
    const materialName = xelib.GetValue(xelib.GetElement(item, 'CNTO'), 'Item');
    if (!materialName) return null;
    return Object.keys(materials).find(key => materialName.includes(key));
  };

  const getMaterial = recipe => {
    // TODO check overrides first

    // Check if the recipe EDID contains the name of the required material.
    let materialKey = Object.keys(materials).find(key => recipe.editorID.includes(key));

    // Temper recipes typically require a single ingot.
    if (!materialKey && isTemperRecipe(recipe)) {
      materialKey = getTemperMaterial(recipe);
    }

    return materials[materialKey];
  };

  const getSmithingPerkEditorID = recipe => {
    const material = getMaterial(recipe);

    if (!material) {
      return skip(recipe, `no material found for ${recipe.outputRecordName}.`);
    }

    return material.smithingPerk;
  };

  const changeRecipeConditions = recipe => {
    if (!locals.useWarrior) return;
    xelib.RemoveElement(recipe.record, 'Conditions');
    // log(`removed all conditions for ${recipe.editorID}`);

    const smithingPerkEditorID = getSmithingPerkEditorID(recipe);
    if (!smithingPerkEditorID) return;
    const smithingPerkFormID = locals.PERK[smithingPerkEditorID];
    xelib.AddCondition(recipe.record, 'HasPerk', conditionOperators.equalTo, '1', smithingPerkFormID);
    // log(`added HasPerk (${smithingPerkEditorID}) condition to ${recipe.editorID} recipe`);
  };

  // TODO this doesn't seem to pick up any records
  const shouldDisableStaffRecipe = recipe => locals.useMage
    && settings.crafting.disableStaffRecipeExclusions.some(exclusion => recipe.outputRecordEditorID.includes(exclusion));

  const handleWorkbench = {
    // TODO confused on what this does
    DLC2StaffEnchanter: recipe => {
      if (!shouldDisableStaffRecipe(recipe)) return;
      xelib.SetUIntValue(recipe.record, 'BNAM', locals.KYWD.ActorTypeNPC);
      log(`disabled staff recipe: ${recipe.editorID}`);
    },
    CraftingSmithingSharpeningWheel: changeRecipeConditions,
    CraftingSmithingArmorTable: changeRecipeConditions,
  };

  const cobjFilter = function (record) {
    const workbench = xelib.GetRefEditorID(record, 'BNAM');
    if (!Object.keys(handleWorkbench).includes(workbench)) return false;
    // TODO GetWinningOverride?
    if (!xelib.GetLinksTo(record, 'CNAM')) {
      // log(`${xelib.EditorID(record)} has no output and will not be patched.`);
      return false;
    }
    return true;
  };

  return {
    load: {
      signature: 'COBJ',
      filter: cobjFilter,
    },
    patch: record => {
      const recipe = new Recipe(record);
      handleWorkbench[recipe.workbench](recipe);
    },
  };
}
