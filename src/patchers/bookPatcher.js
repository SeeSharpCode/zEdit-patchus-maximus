import { isExcludedFromStaffCrafting } from '../exclusions';
import { getLinkedRecord, copyEffects, trimNonAlphaCharacters } from '../utils';

export default function bookPatcher(patch, locals, helpers) {
  const log = message => helpers.logMessage(`(BOOK) ${message}`);

  const supportedSpellSchools = ['Alteration', 'Conjuration', 'Destruction', 'Illusion', 'Restoration'];
  const usedStaffSpells = [];
  const staffTemplates = {
    Destruction: 0x000be11f,
    Conjuration: 0x0007e647,
    Alteration: 0x0007e646,
    Illusion: 0x0007a91b,
    Restoration: 0x00051b0c,
  };

  const copySpellDataToEnchantment = (spell, enchantment) => {
    const targetType = xelib.GetValue(spell, 'SPIT\\Target Type');
    xelib.SetValue(enchantment, 'ENIT\\Target Type', targetType);

    const castType = xelib.GetValue(spell, 'SPIT\\Cast Type');
    xelib.SetValue(enchantment, 'ENIT\\Cast Type', castType);

    const spellName = trimNonAlphaCharacters(xelib.FullName(spell));
    xelib.SetValue(enchantment, 'FULL', `ENCH_${spellName}`);

    const spellBaseCost = xelib.GetValue(spell, 'SPIT\\Base Cost');
    const baseCost = Math.min(100, Math.max(spellBaseCost, 50));
    xelib.SetValue(enchantment, 'ENIT\\Enchantment Cost', baseCost.toString());

    copyEffects(spell, enchantment);
  };

  const createStaffEnchantment = spell => {
    const staffEnchantmentTemplatePath = `PerkusMaximus_Master.esp\\${locals.ENCH.xMAEmptyStaffEnch}`;
    const staffEnchantmentTemplate = xelib.GetElement(0, staffEnchantmentTemplatePath);
    const enchantment = xelib.CopyElement(staffEnchantmentTemplate, patch, true);
    copySpellDataToEnchantment(spell, enchantment);

    const spellEditorID = xelib.EditorID(spell);
    usedStaffSpells.push(spellEditorID);

    const enchantmentName = trimNonAlphaCharacters(xelib.FullName(spell));
    return helpers.cacheRecord(enchantment, `PaMa_ENCH_${enchantmentName}`);
  };

  const getSpellSchool = spell => xelib.GetElements(spell, 'Effects')
    .map(effect => {
      const effectRecord = getLinkedRecord(effect, 'EFID', patch);
      return xelib.GetValue(effectRecord, 'Magic Effect Data\\DATA - Data\\Magic Skill');
    })
    .find(school => supportedSpellSchools.includes(school));

  const createStaffRecipe = (cachedStaff, cleanedSpellName) => {
    const recipe = xelib.AddElement(patch, 'Constructible Object\\COBJ');
    xelib.AddElementValue(recipe, 'EDID', `PaMa_CRAFT_STAFF_${cleanedSpellName}`);
    // TODO finish
  };

  const createStaff = spell => {
    const staffEnchantment = createStaffEnchantment(spell);
    const staffEnchantmentFormID = xelib.GetHexFormID(staffEnchantment);

    const spellSchool = getSpellSchool(spell);
    const staffTemplate = xelib.GetRecord(0, staffTemplates[spellSchool]);
    const staff = xelib.CopyElement(staffTemplate, patch, true);

    xelib.AddElementValue(staff, 'EITM', staffEnchantmentFormID);
    xelib.AddElementValue(staff, 'EAMT', '2500');

    const spellName = xelib.FullName(spell);
    xelib.SetValue(staff, 'FULL', `Staff [${spellName}]`);
    const cleanedSpellName = trimNonAlphaCharacters(spellName);
    const staffEditorID = `PaMa_STAFF_${cleanedSpellName}`;

    const cachedStaff = helpers.cacheRecord(staff, staffEditorID);

    createStaffRecipe(cachedStaff, cleanedSpellName);
  };

  const isDualCastOnly = spell => {
    const equipType = getLinkedRecord(spell, 'ETYP - Equipment Type', patch);
    return xelib.EditorID(equipType) === 'BothHands';
  };

  const isSupportedSpellType = spell => xelib.GetValue(spell, 'SPIT\\Target Type') !== 'Self'
      && xelib.GetValue(spell, 'SPIT - Data\\Cast Type') !== 'Constant Effect';

  const isCompatibleWithStaff = spell => !usedStaffSpells.includes(xelib.EditorID(spell))
      && !isExcludedFromStaffCrafting(spell)
      && !isDualCastOnly(spell)
      && getSpellSchool(spell)
      && isSupportedSpellType(spell);

  const patchBook = book => {
    const spell = getLinkedRecord(book, 'DATA - Data\\Teaches', patch);

    if (!isExcludedFromStaffCrafting(book) && isCompatibleWithStaff(spell)) {
      createStaff(spell);
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
