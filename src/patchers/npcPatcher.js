// TODO resume after figuring out performance issues
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
        xelib.AddPerk(record, locals.passiveScalingSpellsPerkFormID, '1');
        xelib.AddPerk(record, locals.passiveEffectsPerkFormID, '1');
        xelib.AddPerk(record, locals.alchemySkillBoostsPerkFormID, '1');
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
                const spell = xelib.AddElement(record, 'Actor Effects\\SPLO');
                xelib.SetValue(spell, '', locals.thiefModuleCombatAbilityFormID);
            }
        }
    };
};