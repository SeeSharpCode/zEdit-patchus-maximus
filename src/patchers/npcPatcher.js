// TODO patch player
const npcPatcher = function(helpers, settings, locals) {
    const log = message => helpers.logMessage(`(NPC_) ${message}`);

    const npcFilter = function(record) {
        const name = xelib.FullName(record);
        if (!name) {
            return false;
        }
        
        const editorID = xelib.EditorID(record);
        const exclude = locals.npcExclusions.find(expr => expr.test(editorID));
        if (exclude) log(`excluding ${editorID}`);
        return !exclude;
    };

    const addMagePerks = function(record) {
        xelib.AddPerk(record, locals.PERK.xMAMAGPassiveScalingSpells, '1');
        xelib.AddPerk(record, locals.PERK.xMAMAGPassiveEffects, '1');
        xelib.AddPerk(record, locals.PERK.AlchemySkillBoosts, '1');
    };

    const addWarriorPerks = function(record) {
        xelib.AddPerk(record, locals.PERK.xMAHEWScarredPassive, '1');
        xelib.AddPerk(record, locals.PERK.xMAWARPassiveScalingFistWeapon, '1');
        xelib.AddPerk(record, locals.PERK.xMAWARPassiveScalingCriticalDamage, '1');
        xelib.AddPerk(record, locals.PERK.xMAWARPassiveCrossbowEffects, '1');
    };

    const addSpell = function(record, spellFormID) {
        xelib.AddArrayItem(record, 'Actor Effects', '', spellFormID);
    };

    return {
        load: {
            signature: 'NPC_',
            filter: npcFilter
        },
        patch: function (record) {
            if (locals.useMage) {
                addMagePerks(record);
            }
            if (locals.useThief) {
                addSpell(record, locals.SPEL.xMATHICombatAbility);
            }
            if (locals.useWarrior) {
                addWarriorPerks(record);
                addSpell(record, locals.SPEL.xMAWARShieldTypeDetectorAbility);
            }
        }
    };
};