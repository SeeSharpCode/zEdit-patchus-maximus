import { getRecord, getLinkedRecord, copyRecord, createRecipe } from '../utils';
import { isExcludedFromScrollCrafting } from '../exclusions';
import conditionOperators from '../model/conditionOperators';

export default (patchFile, locals, helpers) => {
  const usedScrollSpells = [];
  const scrollMagicEffects = {};

  const spellTierPerks = {
    0: 'xMAENCBasicScripture',
    25: 'xMAENCBasicScripture',
    50: 'xMAENCAdvancedScripture',
    75: 'xMAENCElaborateScripture',
    100: 'xMAENCSagesScripture',
  };

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
      xelib.GetValue(spellEffect, 'EFIT\\Duration'),
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

  const getSpellSkillLevel = spell => {
    const skillLevels = spell.effects.map(effect => {
      const magicEffect = getLinkedRecord(effect, 'EFID', patchFile);
      return xelib.GetValue(magicEffect, 'Magic Effect Data\\DATA - Data\\Minimum Skill Level');
    });

    return Math.max(...skillLevels);
  };

  const getScrollCraftingPerk = spell => {
    const spellSkillLevel = getSpellSkillLevel(spell);
    const perkEditorID = spellTierPerks[spellSkillLevel];
    return locals.PERK[perkEditorID];
  };

  const createScrollRecipe = (scroll, spell, spellFormName) => {
    const requiredPerk = getScrollCraftingPerk(spell);
    if (!requiredPerk) {
      return;
    }

    const recipe = createRecipe(`PaMa_CRAFT_SCRO_${spellFormName}`,
      locals.KYWD.xMAENCCraftingScroll, xelib.GetHexFormID(scroll), patchFile, helpers);

    xelib.AddCondition(recipe, 'HasPerk', conditionOperators.equalTo, '1', requiredPerk);
    xelib.AddCondition(recipe, 'HasSpell', conditionOperators.equalTo, '1', spell.hexFormID);

    xelib.AddItem(recipe, locals.MISC.Inkwell01, '1');
    xelib.AddItem(recipe, locals.MISC.PaperRoll, '1');
  };

  const createScroll = spell => {
    const scrollTemplate = getRecord('PerkusMaximus_Master.esp', locals.SCRL.xMAScrollEmpty);
    const spellFormName = spell.cleanedName + spell.hexFormID;
    const scroll = copyRecord(scrollTemplate, `PaMa_SCRO_${spellFormName}`, patchFile, helpers);
    copySpellDataToScroll(spell, scroll);
    usedScrollSpells.push(spell.editorID);

    createScrollRecipe(scroll, spell, spellFormName);
  };

  const shouldCreateScroll = (book, spell) => !isExcludedFromScrollCrafting(book)
    && !isExcludedFromScrollCrafting(spell.record)
    && !usedScrollSpells.includes(spell.editorID)
    && spell.castType !== 'Concentration';

  return {
    shouldCreateScroll,
    createScroll,
  };
};
