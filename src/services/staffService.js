import { isExcludedFromStaffCrafting } from '../exclusions';
import { getRecord, copyRecord, copyEffects, createRecipe } from '../utils';
import conditionOperators from '../model/conditionOperators';

export default (patchFile, locals, helpers) => {
  const usedStaffSpells = [];

  const staffTemplates = {
    Destruction: 0x000be11f,
    Conjuration: 0x0007e647,
    Alteration: 0x0007e646,
    Illusion: 0x0007a91b,
    Restoration: 0x00051b0c,
  };

  const copySpellDataToEnchantment = (spell, enchantment) => {
    xelib.SetValue(enchantment, 'ENIT\\Target Type', spell.targetType);
    xelib.SetValue(enchantment, 'ENIT\\Cast Type', spell.castType);
    xelib.SetValue(enchantment, 'FULL', `ENCH_${spell.cleanedName}`);

    const baseCost = Math.min(100, Math.max(spell.baseCost, 50));
    xelib.SetValue(enchantment, 'ENIT\\Enchantment Cost', baseCost.toString());

    copyEffects(spell.record, enchantment);
  };

  const createStaffEnchantment = spell => {
    const staffEnchantmentTemplate = getRecord('PerkusMaximus_Master.esp', locals.ENCH.xMAEmptyStaffEnch);
    const enchantment = copyRecord(staffEnchantmentTemplate, `PaMa_ENCH_${spell.cleanedName}`, patchFile, helpers);
    copySpellDataToEnchantment(spell, enchantment);
    usedStaffSpells.push(spell.editorID);
    return enchantment;
  };

  const createStaffRecipe = (staff, staffTemplate, spell, book) => {
    const recipe = createRecipe(`PaMa_CRAFT_STAFF_${spell.cleanedName}`, locals.KYWD.DLC2StaffEnchanter,
      xelib.GetHexFormID(staff), patchFile, helpers);

    xelib.AddCondition(recipe, 'HasPerk', conditionOperators.equalTo, '1', locals.PERK.xMAENCStaffaire);
    xelib.AddCondition(recipe, 'HasSpell', conditionOperators.equalTo, '1', spell.hexFormID);

    xelib.AddItem(recipe, xelib.GetHexFormID(staffTemplate), '1');
    xelib.AddItem(recipe, xelib.GetHexFormID(book), '1');
  };

  const createStaff = (book, spell) => {
    const staffEnchantment = createStaffEnchantment(spell);
    const staffEnchantmentFormID = xelib.GetHexFormID(staffEnchantment);

    const staffTemplate = xelib.GetRecord(0, staffTemplates[spell.getSpellSchool(patchFile)]);
    const staff = copyRecord(staffTemplate, `PaMa_STAFF_${spell.cleanedName}`, patchFile, helpers);

    xelib.AddElementValue(staff, 'EITM', staffEnchantmentFormID);
    xelib.AddElementValue(staff, 'EAMT', '2500');
    xelib.SetValue(staff, 'FULL', `Staff [${spell.name}]`);

    createStaffRecipe(staff, staffTemplate, spell, book);
  };

  const shouldCreateStaff = (book, spell) => !isExcludedFromStaffCrafting(book)
    && !isExcludedFromStaffCrafting(spell.record)
    && !usedStaffSpells.includes(spell.editorID)
    && spell.isCompatibleWithStaff(patchFile);

  return {
    shouldCreateStaff,
    createStaff,
  };
};
