import { addSpell } from '../utils';
import { isExcludedFromPatching } from '../exclusions';

export default function npcPatcher(helpers, locals, settings) {
  // TODO log exclusions
  const log = message => helpers.logMessage(`(NPC_) ${message}`);

  const patchNpc = npc => {
    if (locals.useMage) {
      xelib.AddPerk(npc, locals.PERK.xMAMAGPassiveScalingSpells, '1');
      xelib.AddPerk(npc, locals.PERK.xMAMAGPassiveEffects, '1');
      xelib.AddPerk(npc, locals.PERK.AlchemySkillBoosts, '1');
    }
    if (locals.useThief) {
      addSpell(npc, locals.SPEL.xMATHICombatAbility);
    }
    if (locals.useWarrior) {
      xelib.AddPerk(npc, locals.PERK.xMAHEWScarredPassive, '1');
      xelib.AddPerk(npc, locals.PERK.xMAWARPassiveScalingFistWeapon, '1');
      addSpell(npc, locals.SPEL.xMAWARShieldTypeDetectorAbility);
      xelib.AddPerk(npc, locals.PERK.xMAWARPassiveScalingCriticalDamage, '1');
      xelib.AddPerk(npc, locals.PERK.xMAWARPassiveCrossbowEffects, '1');
    }
  };

  const patchPlayer = player => {
    addSpell(player, locals.SPEL.xMAWeaponSpeedFix);

    if (locals.useMage) {
      xelib.RemoveArrayItem(player, 'Actor Effects', '', locals.SPEL.Flames);
      xelib.RemoveArrayItem(player, 'Actor Effects', '', locals.SPEL.Healing);
      addSpell(player, locals.SPEL.xMAMAGMainAbility);
      xelib.AddPerk(player, locals.PERK.xMAMAGPassiveScalingSpellsScroll, '1');

      if (settings.npc.startingSpells) {
        addSpell(player, locals.SPEL.xMADESFireFlames);
        addSpell(player, locals.SPEL.xMARESHealRecovery);
      }
    }

    if (locals.useThief) {
      xelib.AddPerk(player, locals.PERK.xMATHIPassiveLockpickingXP, '1');
      xelib.AddPerk(player, locals.PERK.xMATHIPassiveSpellSneakScaling, '1');
      xelib.AddPerk(player, locals.PERK.xMATHIPassiveArmorSneakPenalty, '1');
      xelib.AddPerk(player, locals.PERK.xMATHIPassiveWeaponSneakScaling, '1');
      addSpell(player, locals.SPEL.xMATHIMainAbility);
      addSpell(player, locals.SPEL.xMATHIInitSneakTools);
      xelib.AddPerk(player, locals.PERK.xMATHIPassiveShoutScaling, '1');
    }

    if (locals.useWarrior) {
      addSpell(player, locals.SPEL.xMAWARTimedBlockingAbility);
      xelib.AddPerk(player, locals.PERK.ArcaneBlacksmith, '1');
      xelib.AddPerk(player, locals.PERK.xMAWARPassiveDualWieldMalus, '1');
    }
  };

  return {
    load: {
      signature: 'NPC_',
      filter: npc => xelib.FullName(npc) && !isExcludedFromPatching(npc),
    },
    patch: record => {
      patchNpc(record);

      if (xelib.GetHexFormID(record) === locals.playerFormID) {
        patchPlayer(record);
      }
    },
  };
}
