import { isExcludedFromStaffCrafting } from '../exclusions';
import { getLinkedRecord, trimWhitespace } from '../utils';

export default function bookPatcher(patch, locals, helpers) {
  const log = message => helpers.logMessage(`(BOOK) ${message}`);

  const supportedSpellSchools = ['Alteration', 'Conjuration', 'Destruction', 'Illusion', 'Restoration'];
  const usedSpells = [];

  const copySpellDataToEnchantment = (spell, enchantment) => {
    const targetType = xelib.GetValue(spell, 'SPIT\\Target Type');
    xelib.SetValue(enchantment, 'ENIT\\Target Type', targetType);

    const castType = xelib.GetValue(spell, 'SPIT\\Cast Type');
    xelib.SetValue(enchantment, 'ENIT\\Cast Type', castType);

    const spellName = trimWhitespace(xelib.FullName(spell));
    xelib.SetValue(enchantment, 'FULL', `ENCH_${spellName}`);

    const spellBaseCost = xelib.GetValue(spell, 'SPIT\\Base Cost');
    const baseCost = Math.min(100, Math.max(spellBaseCost, 50));
    xelib.SetValue(enchantment, 'ENIT\\Enchantment Cost', baseCost.toString());
  };

  const createStaffEnchantment = spell => {
    const staffEnchantmentTemplatePath = `PerkusMaximus_Master.esp\\${locals.ENCH.xMAEmptyStaffEnch}`;
    const staffEnchantmentTemplate = xelib.GetElement(0, staffEnchantmentTemplatePath);
    const enchantment = xelib.CopyElement(staffEnchantmentTemplate, patch, true);
    copySpellDataToEnchantment(spell, enchantment);

    const spellEditorID = xelib.EditorID(spell);
    usedSpells.push(spellEditorID);

    const enchantmentName = trimWhitespace(xelib.FullName(spell));
    return helpers.cacheRecord(enchantment, `PaMa_ENCH_${enchantmentName}`);
  };

  const createStaff = spell => {
    const staffEnchantment = createStaffEnchantment(spell);
  };

  const isDualCastOnly = spell => {
    const equipType = getLinkedRecord(spell, 'ETYP - Equipment Type', patch);
    return xelib.EditorID(equipType) === 'BothHands';
  };

  const isSupportedSpellSchool = spell => {
    return xelib.GetElements(spell, 'Effects')
      .map(effect => {
        const effectRecord = getLinkedRecord(effect, 'EFID', patch);
        return xelib.GetValue(effectRecord, 'Magic Effect Data\\DATA - Data\\Magic Skill');
      })
      .some(school => supportedSpellSchools.includes(school));
  };

  const isSupportedSpellType = spell => xelib.GetValue(spell, 'SPIT\\Target Type') !== 'Self'
      && xelib.GetValue(spell, 'SPIT - Data\\Cast Type') !== 'Constant Effect';

  const spellFilter = spell => {
    const spellEditorID = xelib.EditorID(spell);
    return !isExcludedFromStaffCrafting(spellEditorID)
      && !usedSpells.includes(spellEditorID)
      && !isDualCastOnly(spell)
      && isSupportedSpellSchool(spell)
      && isSupportedSpellType(spell);
  };

  const bookFilter = book => {
    if (isExcludedFromStaffCrafting(xelib.EditorID(book))) {
      return false;
    }

    const spellFlag = xelib.GetFlag(book, 'DATA - Data\\Flags', 'Teaches Spell');
    if (!spellFlag) {
      return false;
    }

    const spell = getLinkedRecord(book, 'DATA - Data\\Teaches', patch);
    return spellFilter(spell);
  };

  return {
    load: {
      signature: 'BOOK',
      filter: bookFilter
    },
    patch: record => {
      const spell = getLinkedRecord(record, 'DATA - Data\\Teaches', patch);
      createStaff(spell);
    }
  };
}
