import { isExcludedFromStaffCrafting } from '../exclusions';
import { getLinkedRecord } from '../utils';

export default function bookPatcher(patch, locals, helpers) {
  const log = message => helpers.logMessage(`(BOOK) ${message}`);

  const supportedSpellSchools = ['Alteration', 'Conjuration', 'Destruction', 'Illusion', 'Restoration'];

  const shouldCreateStaffEnchantment = spell => {
    const castType = xelib.GetValue(spell, 'SPIT - Data\\Cast Type');
    if (castType === 'Constant Effect') {
      log(`skipping staff creation for Constant Effect spell: ${xelib.FullName(spell)}`);
      return false;
    }

    const targetType = xelib.GetValue(spell, 'SPIT - Data\\Target Type');
    if (targetType === 'Self') {
      log(`skipping staff creation for self-targeting spell: ${xelib.FullName(spell)}`);
      return false;
    }

    const equipType = getLinkedRecord(spell, 'ETYP - Equipment Type', patch);
    if (xelib.EditorID(equipType) === 'BothHands') {
      log(`skipping staff creation for dual cast spell: ${xelib.FullName(spell)}`);
      return false;
    }

    return xelib.GetElements(spell, 'Effects')
      .map(effect => getLinkedRecord(effect, 'EFID', patch))
      .some(effect => {
        const magicSkill = xelib.GetValue(effect, 'Magic Effect Data\\DATA - Data\\Magic Skill');
        return supportedSpellSchools.includes(magicSkill);
      });
  };

  const copySpellDataToEnchantment = (spell, enchantment) => {
    const targetType = xelib.GetValue(spell, 'SPIT\\Target Type');
    xelib.SetValue(enchantment, 'ENIT\\Target Type', targetType);

    const castType = xelib.GetValue(spell, 'SPIT\\Cast Type');
    xelib.SetValue(enchantment, 'ENIT\\Cast Type', castType);

    const spellName = xelib.FullName(spell);
    xelib.SetValue(enchantment, 'FULL', `ENCH_${spellName}`);

    const spellBaseCost = xelib.GetValue(spell, 'SPIT\\Base Cost');
    const baseCost = Math.min(100, Math.max(spellBaseCost, 50));
    xelib.SetValue(enchantment, 'ENIT\\Enchantment Cost', baseCost.toString());
  };

  const createStaffEnchantment = spell => {
    if (!shouldCreateStaffEnchantment(spell)) return null;

    const staffPath = `PerkusMaximus_Master.esp\\${locals.ENCH.xMAEmptyStaffEnch}`;
    const staffEnchantmentTemplate = xelib.GetElement(0, staffPath);
    const enchantment = xelib.CopyElement(staffEnchantmentTemplate, patch, true);
    copySpellDataToEnchantment(spell, enchantment);

    return helpers.cacheRecord(enchantment, `PaMa_ENCH_${xelib.FullName(spell)}`);
  };

  const shouldCreateStaff = (bookEditorID, spellEditorID) => {
    return !isExcludedFromStaffCrafting(bookEditorID) && !isExcludedFromStaffCrafting(spellEditorID);
  };

  const createStaff = spell => {
    const staffEnchantment = createStaffEnchantment(spell);
  };

  return {
    load: {
      signature: 'BOOK',
      filter: record => xelib.GetFlag(record, 'DATA - Data\\Flags', 'Teaches Spell')
    },
    patch: record => {
      const editorID = xelib.EditorID(record);
      const spell = getLinkedRecord(record, 'DATA - Data\\Teaches', patch);
      const spellEditorID = xelib.EditorID(spell);

      if (shouldCreateStaff(editorID, spellEditorID)) {
        createStaff(spell);
      }
    }
  };
}
