// TODO resume after figuring out performance issues
const npcPatcher = function(helpers, settings, locals) {
    const log = message => helpers.logMessage(`(NPC_) ${message}`);

    const npcFilter = function(record) {
        const name = xelib.FullName(record);
        if (name && name.includes('NO TEXT')) {
            return false;
        }
        
        const editorID = xelib.EditorID(record);
        const exclusions = locals.npcExclusions.map(e => new RegExp(e));
        const exclude = exclusions.find(expr => expr.test(editorID));
        if (exclude) log(`excluding ${editorID}`);
        return !exclude;
    };

    const addMagePerks = function(record) {
        xelib.AddPerk(record, 'xMAMAGPassiveScalingSpells', '1');
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
        }
    };
};