import Recipe from '../model/recipe';
import conditionOperators from '../model/conditionOperators';
import materials from '../../config/materials.json';
import { getLinkedRecord } from '../utils';

export default function cobjPatcher(patchFile, helpers, locals, settings) {
  const log = message => helpers.logMessage(`(COBJ) ${message}`);

  // TODO guard equipment
  // TODO Should I keep this? Will it be necessary with the equipment fixes tool?
  const factionMaterials = {
    ArmorDarkBrotherhood: 'Leather',
    ArmorNightingale: 'Leather',
    DLC1LD_CraftingMaterialAetherium: 'Dwarven',
  };

  const getMaterial = equipment => {
    let materialName = helpers.skyrimMaterialService.getMaterial(equipment);

    if (!materialName) {
      const faction = Object.keys(factionMaterials).find(keyword => xelib.HasKeyword(equipment, keyword));
      materialName = factionMaterials[faction];
    }

    return materials[materialName];
  };

  const getSmithingPerk = recipe => {
    const output = getLinkedRecord(recipe.record, 'CNAM', patchFile);
    const material = getMaterial(output);
    return material ? material.smithingPerk : log(`${xelib.FullName(output)} (${xelib.EditorID(output)}) doesn't have a material`);
  };

  const addMaterialPerkRequirement = recipe => {
    if (!locals.useWarrior) {
      return;
    }

    xelib.RemoveElement(recipe.record, 'Conditions');

    const smithingPerk = getSmithingPerk(recipe);

    if (!smithingPerk) {
      return;
    }

    const smithingPerkFormID = locals.PERK[smithingPerk];
    xelib.AddCondition(recipe.record, 'HasPerk', conditionOperators.equalTo, '1', smithingPerkFormID);
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
    CraftingSmithingSharpeningWheel: addMaterialPerkRequirement,
    CraftingSmithingArmorTable: addMaterialPerkRequirement,
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
      // TODO convert the Recipe class into an object
      const recipe = new Recipe(record);
      handleWorkbench[recipe.workbench](recipe);
    },
  };
}
