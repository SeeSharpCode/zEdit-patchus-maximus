import { isExcludedFromStaffCrafting, isExcludedFromScrollCrafting } from '../exclusions';
import { getRecord, getLinkedRecord, copyRecord, copyEffects } from '../utils';
import conditionOperators from '../model/conditionOperators';
import Spell from '../model/spell';

export default function bookPatcher(patchFile, locals, helpers) {
  const log = message => helpers.logMessage(`(BOOK) ${message}`);

  const scrollMagicEffects = {};
  const usedScrollSpells = [];
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
    const recipe = xelib.AddElement(patchFile, 'Constructible Object\\COBJ');
    // helpers.cacheRecord will only set the EDID field if it exists
    xelib.AddElement(recipe, 'EDID');
    const cachedRecipe = helpers.cacheRecord(recipe, `PaMa_CRAFT_STAFF_${spell.cleanedName}`);

    xelib.AddElementValue(cachedRecipe, 'BNAM', locals.KYWD.DLC2StaffEnchanter);
    xelib.AddElementValue(cachedRecipe, 'CNAM', xelib.GetHexFormID(staff));
    xelib.AddElementValue(cachedRecipe, 'NAM1', '1');

    xelib.AddCondition(cachedRecipe, 'HasPerk', conditionOperators.equalTo, '1', locals.PERK.xMAENCStaffaire);
    xelib.AddCondition(cachedRecipe, 'HasSpell', conditionOperators.equalTo, '1', spell.hexFormID);

    xelib.AddItem(cachedRecipe, xelib.GetHexFormID(staffTemplate), '1');
    xelib.AddItem(cachedRecipe, xelib.GetHexFormID(book), '1');
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

  const createScrollEffect = (scroll, spellEffect) => {
    const spellMagicEffect = getLinkedRecord(spellEffect, 'EFID', patchFile);
    const spellMagicEffectEditorID = xelib.EditorID(spellMagicEffect);

    let scrollMagicEffect = scrollMagicEffects[spellMagicEffectEditorID];
    if (!scrollMagicEffect) {
      scrollMagicEffect = copyRecord(spellMagicEffect, `PaMa_SCRO_MGEF_${spellMagicEffectEditorID}`, patchFile, helpers);
      scrollMagicEffects[spellMagicEffectEditorID] = scrollMagicEffect;
    }
    xelib.AddKeyword(scrollMagicEffect, locals.KYWD.xMAENCScrollSpellKW);

    xelib.AddEffect(
      scroll,
      xelib.GetHexFormID(scrollMagicEffect),
      xelib.GetValue(spellEffect, 'EFIT\\Magnitude'),
      xelib.GetValue(spellEffect, 'EFIT\\Area'),
      xelib.GetValue(spellEffect, 'EFIT\\Duration')
    );
  };

  const copySpellDataToScroll = (spell, scroll) => {
    xelib.SetValue(scroll, 'SPIT\\Cast Duration', spell.castDuration);
    xelib.SetValue(scroll, 'SPIT\\Cast Type', spell.castType);
    xelib.SetValue(scroll, 'SPIT\\Charge Time', spell.chargeTime);
    xelib.SetValue(scroll, 'SPIT\\Target Type', spell.targetType);
    xelib.SetValue(scroll, 'ETYP', spell.equipType);
    xelib.SetValue(scroll, 'SPIT\\Type', spell.type);
    xelib.SetValue(scroll, 'FULL', `${spell.name} [Scroll]`);
    xelib.RemoveElement(scroll, 'Effects');
    spell.effects.forEach(spellEffect => createScrollEffect(scroll, spellEffect));
  };

  const createScroll = spell => {
    const scrollTemplate = getRecord('PerkusMaximus_Master.esp', locals.SCRL.xMAScrollEmpty);
    const scroll = copyRecord(scrollTemplate, `PaMa_SCRO_${spell.cleanedName}${spell.hexFormID}`, patchFile, helpers);
    copySpellDataToScroll(spell, scroll);
    usedScrollSpells.push(spell.editorID);
  };

  const shouldCreateScroll = (book, spell) => !isExcludedFromScrollCrafting(book)
    && !isExcludedFromScrollCrafting(spell.record)
    && !usedScrollSpells.includes(spell.editorID)
    && spell.castType !== 'Concentration';

  const patchBook = book => {
    const spellRecord = getLinkedRecord(book, 'DATA - Data\\Teaches', patchFile);
    const spell = new Spell(spellRecord);

    if (shouldCreateStaff(book, spell)) {
      createStaff(book, spell);
    }
    if (shouldCreateScroll(book, spell)) {
      createScroll(spell);
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
