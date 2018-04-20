// TODO: if useWarrior
patchers.push({
    load: function (plugin, helpers, settings, locals) {
        return {
            signature: 'GMST',
            filter: function (record) {
                let editorID = xelib.EditorID(record);
                return Object.keys(locals.gameSettings).includes(editorID);
            }
        }
    },
    patch: function (record, helpers, settings, locals) {
        let editorID = xelib.EditorID(record);
        let value = locals.gameSettings[editorID];
        helpers.logMessage(`Setting ${editorID} to ${value}`);
        xelib.SetFloatValue(record, 'DATA\\Float', value);
    }
});