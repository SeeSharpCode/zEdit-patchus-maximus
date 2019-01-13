import { isExcludedFromStaffCrafting, isExcludedFromScrollCrafting } from '../exclusions';
import { getLinkedRecord, copyEffects } from '../utils';
import conditionOperators from '../model/conditionOperators';
import Spell from '../model/spell';

export default function bookPatcher(patchFile, locals, helpers) {
  const log = message => helpers.logMessage(`(BOOK) ${message}`);

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
    const staffEnchantmentTemplatePath = `PerkusMaximus_Master.esp\\${locals.ENCH.xMAEmptyStaffEnch}`;
    const staffEnchantmentTemplate = xelib.GetElement(0, staffEnchantmentTemplatePath);
    const enchantment = xelib.CopyElement(staffEnchantmentTemplate, patchFile, true);
    copySpellDataToEnchantment(spell, enchantment);
    usedStaffSpells.push(spell.editorID);
    return helpers.cacheRecord(enchantment, `PaMa_ENCH_${spell.cleanedName}`);
  };

  const createStaffRecipe = (staff, spell, book) => {
    const recipe = xelib.AddElement(patchFile, 'Constructible Object\\COBJ');

    xelib.AddElementValue(recipe, 'EDID', `PaMa_CRAFT_STAFF_${spell.cleanedName}`);
    xelib.AddElementValue(recipe, 'BNAM', locals.KYWD.DLC2StaffEnchanter);
    xelib.AddElementValue(recipe, 'CNAM', xelib.GetHexFormID(staff));
    xelib.AddElementValue(recipe, 'NAM1', '1');

    xelib.AddCondition(recipe, 'HasPerk', conditionOperators.equalTo, '1', locals.PERK.xMAENCStaffaire);
    xelib.AddCondition(recipe, 'HasSpell', conditionOperators.equalTo, '1', spell.hexFormID);

    const staffTemplate = xelib.GetRecord(0, staffTemplates[spell.getSpellSchool(patchFile)]);
    xelib.AddItem(recipe, xelib.GetHexFormID(staffTemplate), '1');
    xelib.AddItem(recipe, xelib.GetHexFormID(book), '1');
  };

  const createStaff = (book, spell) => {
    const staffEnchantment = createStaffEnchantment(spell);
    const staffEnchantmentFormID = xelib.GetHexFormID(staffEnchantment);

    const staffTemplate = xelib.GetRecord(0, staffTemplates[spell.getSpellSchool(patchFile)]);
    const staff = xelib.CopyElement(staffTemplate, patchFile, true);

    xelib.AddElementValue(staff, 'EITM', staffEnchantmentFormID);
    xelib.AddElementValue(staff, 'EAMT', '2500');
    xelib.SetValue(staff, 'FULL', `Staff [${spell.name}]`);
    const staffEditorID = `PaMa_STAFF_${spell.cleanedName}`;

    const cachedStaff = helpers.cacheRecord(staff, staffEditorID);

    createStaffRecipe(cachedStaff, spell, book);
  };

  const shouldCreateStaff = (book, spell) => !isExcludedFromStaffCrafting(book)
    && !isExcludedFromStaffCrafting(spell.record)
    && !usedStaffSpells.includes(spell.editorID)
    && spell.isCompatibleWithStaff(patchFile);

  const shouldCreateScroll = (book, spell) => !isExcludedFromScrollCrafting(book)
    && !isExcludedFromScrollCrafting(spell.record)
    && spell.castType !== 'Concentration';

  const patchBook = book => {
    const spellRecord = getLinkedRecord(book, 'DATA - Data\\Teaches', patchFile);
    const spell = new Spell(spellRecord);

    if (shouldCreateStaff(book, spell)) {
      createStaff(book, spell);
    }
    if (shouldCreateScroll(book, spell)) {
    }
  };

  return {
    load: {
      signature: 'BOOK',
      filter: book => xelib.GetFlag(book, 'DATA - Data\\Flags', 'Teaches Spell')
    },
    patch: patchBook
  };
}
