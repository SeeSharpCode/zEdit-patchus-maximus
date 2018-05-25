const npcPatcher = function(helpers, settings, locals) {
    let exclusions = locals.npcExclusions.map(e => new Regexp(e));

    let filterFn = function(record) {
        let editorID = xelib.EditorID(record);
        if (!xelib.FullName(record)) return;
        return !!exclusions.find(expr => expr.test(editorID));
    };

    return {
        load: {
            signature: 'NPC_',
            filter: filterFn
        },
        patch: function (record) {
            // TODO
        }
    };
};