import conditionOperators from '../model/conditionOperators';
import materials from '../../config/materials.json';
import { getLinkedRecord } from '../utils';

export default function cobjPatcher(patchFile, helpers, locals, settings) {
  const log = message => helpers.logMessage(`(COBJ) ${message}`);

  const getMaterial = outputRecord => {
    const materialName = helpers.skyrimMaterialService.getMaterial(outputRecord);
    return materials[materialName];
  };

  const getSmithingPerk = cobj => {
    const outputRecord = getLinkedRecord(cobj, 'CNAM', patchFile);
    const material = getMaterial(outputRecord);
    return material
      ? locals.PERK[material.smithingPerk]
      : log(`${xelib.FullName(outputRecord)} doesn't have a material`);
  };

  const addMaterialPerkRequirement = cobj => {
    if (!locals.useWarrior) {
      return;
    }

    xelib.RemoveElement(cobj, 'Conditions');

    const smithingPerk = getSmithingPerk(cobj);

    if (!smithingPerk) {
      return;
    }

    xelib.AddCondition(cobj, 'HasPerk', conditionOperators.equalTo, '1', smithingPerk);
  };

  // TODO this doesn't seem to pick up any records
  const shouldDisableStaffRecipe = cobj => {
    if (!locals.useMage) {
      return false;
    }

    const outputEDID = xelib.GetRefEditorID(cobj, 'CNAM');
    const { disableStaffRecipeExclusions } = settings.crafting;
    return disableStaffRecipeExclusions.some(exclusion => outputEDID.includes(exclusion));
  };

  const handleWorkbench = {
    DLC2StaffEnchanter: cobj => {
      if (!shouldDisableStaffRecipe(cobj)) {
        return;
      }
      xelib.SetUIntValue(cobj, 'BNAM', locals.KYWD.ActorTypeNPC);
      log(`disabled staff recipe: ${xelib.EditorID(cobj)}`);
    },
    CraftingSmithingSharpeningWheel: addMaterialPerkRequirement,
    CraftingSmithingArmorTable: addMaterialPerkRequirement,
  };

  const getWorkbench = cobj => xelib.GetRefEditorID(cobj, 'BNAM');

  return {
    load: {
      signature: 'COBJ',
      filter: cobj => Object.keys(handleWorkbench).includes(getWorkbench(cobj)) && xelib.GetLinksTo(cobj, 'CNAM'),
    },
    patch: cobj => {
      handleWorkbench[getWorkbench(cobj)](cobj);
    },
  };
}
