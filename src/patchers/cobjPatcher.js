import Recipe from '../model/recipe';
import conditionOperators from '../model/conditionOperators';
import recipeMaterials from '../../config/recipeMaterials.json';
import { getLinkedRecord } from '../utils';

export default function cobjPatcher(patchFile, helpers, locals, settings) {
  const log = message => helpers.logMessage(`(COBJ) ${message}`);
  const skip = (recipe, message) => {
    log(`${message} ${recipe.editorID} will not be patched.`);
  };

  // We're mostly patching tempering recipes, so we can try to get the
  // required smithing perk from the corresponding crafting recipe.
  const getSmithingPerkFromCraftingRecipe = recipe => {
    const itemName = recipe.editorID.split('Temper')[1];
    if (!itemName) return null;

    const craftingRecipeEditorID = Object.keys(locals.COBJ).find(editorID => editorID.split('Recipe')[1] === itemName);
    if (!craftingRecipeEditorID) return null;

    const condition = xelib.GetCondition(locals.COBJ[craftingRecipeEditorID], 'HasPerk');
    if (!condition) return null;
    return xelib.EditorID(getLinkedRecord(condition, 'CTDA\\Parameter #1', patchFile));
  };

  const getSmithingPerkFromRecipeEditorID = editorID => {
    const materialKey = Object.keys(recipeMaterials).find(key => editorID.includes(key));
    return materialKey ? recipeMaterials[materialKey].smithingPerk : null;
  };

  const getSmithingPerkFromRequiredItem = recipe => {
    if (!xelib.HasElement(recipe.record, 'Items\\[0]\\CNTO\\Item')) return null;
    const requiredItem = getLinkedRecord(recipe.record, 'Items\\[0]\\CNTO\\Item', patchFile);
    const materialKey = Object.keys(recipeMaterials).find(key => xelib.EditorID(requiredItem).includes(key));
    return materialKey ? recipeMaterials[materialKey].smithingPerk : null;
  };

  const getSmithingPerk = recipe => getSmithingPerkFromRecipeEditorID(recipe.editorID)
      || getSmithingPerkFromCraftingRecipe(recipe)
      || getSmithingPerkFromRequiredItem(recipe); // Fallback. Not always reliable, e.g. Daedric recipes use ebony.

  const changeRecipeConditions = recipe => {
    if (!locals.useWarrior) return;
    xelib.RemoveElement(recipe.record, 'Conditions');

    const smithingPerkEditorID = getSmithingPerk(recipe);

    if (!smithingPerkEditorID) {
      // TODO only log this if no perk was found, not if no perk is needed
      log(`No smithing perk requirement found for ${recipe.editorID}.`);
      return;
    }

    const smithingPerkFormID = locals.PERK[smithingPerkEditorID];
    xelib.AddCondition(recipe.record, 'HasPerk', conditionOperators.equalTo, '1', smithingPerkFormID);
    log(`${recipe.editorID} required perk set to ${smithingPerkEditorID}.`);
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
