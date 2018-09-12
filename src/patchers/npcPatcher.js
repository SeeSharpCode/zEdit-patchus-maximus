import { addSpell } from '../util';

export default function npcPatcher(helpers, locals) {
    const log = message => helpers.logMessage(`(NPC_) ${message}`);

    const npcFilter = function (record) {
        const name = xelib.FullName(record);
        if (!name) {
            return false;
        }

        const editorID = xelib.EditorID(record);
        const exclude = locals.npcExclusions.find(expr => expr.test(editorID));
        if (exclude) log(`excluding ${editorID}`);
        return !exclude;
    };

    const patchNpc = function patchNpc(record) {
        if (locals.useMage) {
            xelib.AddPerk(record, locals.PERK.xMAMAGPassiveScalingSpells, '1');
            xelib.AddPerk(record, locals.PERK.xMAMAGPassiveEffects, '1');
            xelib.AddPerk(record, locals.PERK.AlchemySkillBoosts, '1');
        }
        if (locals.useThief) {
            addSpell(record, locals.SPEL.xMATHICombatAbility);
        }
        if (locals.useWarrior) {
            xelib.AddPerk(record, locals.PERK.xMAHEWScarredPassive, '1');
            xelib.AddPerk(record, locals.PERK.xMAWARPassiveScalingFistWeapon, '1');
            addSpell(record, locals.SPEL.xMAWARShieldTypeDetectorAbility);
            xelib.AddPerk(record, locals.PERK.xMAWARPassiveScalingCriticalDamage, '1');
            xelib.AddPerk(record, locals.PERK.xMAWARPassiveCrossbowEffects, '1');
        }
    };

    const patchPlayer = function(record) {
        addSpell(record, locals.SPEL.xMAWeaponSpeedFix);

        if (locals.useMage) {
            xelib.RemoveArrayItem(record, 'Actor Effects', '', locals.SPEL.Flames);
            xelib.RemoveArrayItem(record, 'Actor Effects', '', locals.SPEL.Healing);
            addSpell(record, locals.SPEL.xMAMAGMainAbility);
            xelib.AddPerk(record, locals.PERK.xMAMAGPassiveScalingSpellsScroll, '1');

            // TODO control this via a setting
            addSpell(record, locals.SPEL.xMADESFireFlames);
            addSpell(record, locals.SPEL.xMARESHealRecovery);
        }

        if (locals.useThief) {
            xelib.AddPerk(record, locals.PERK.xMATHIPassiveLockpickingXP, '1');
            xelib.AddPerk(record, locals.PERK.xMATHIPassiveSpellSneakScaling, '1');
            xelib.AddPerk(record, locals.PERK.xMATHIPassiveArmorSneakPenalty, '1');
            xelib.AddPerk(record, locals.PERK.xMATHIPassiveWeaponSneakScaling, '1');
            addSpell(record, locals.SPEL.xMATHIMainAbility);
            addSpell(record, locals.SPEL.xMATHIInitSneakTools);
            xelib.AddPerk(record, locals.PERK.xMATHIPassiveShoutScaling, '1');
        }

        if (locals.useWarrior) {
            addSpell(record, locals.SPEL.xMAWARTimedBlockingAbility);
            xelib.AddPerk(record, locals.PERK.ArcaneBlacksmith, '1');
            xelib.AddPerk(record, locals.PERK.xMAWARPassiveDualWieldMalus, '1');
        }
    };

    return {
        load: {
            signature: 'NPC_',
            filter: npcFilter
        },
        patch: record => {
            patchNpc(record);

            if (xelib.GetHexFormID(record) === locals.playerFormID) {
                patchPlayer(record);
            }
        }
    };
}
