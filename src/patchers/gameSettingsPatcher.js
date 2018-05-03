// // TODO: if useWarrior
const gameSettingsPatcher = function() {
    return {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'GMST',
                filter: function (record) {
                    const editorID = xelib.EditorID(record);
                    return Object.keys(locals.gameSettings).includes(editorID);
                }
            };
        },
        patch: function (record, helpers, settings, locals) {
            const editorID = xelib.EditorID(record);
            const value = locals.gameSettings[editorID];
            xelib.SetFloatValue(record, 'DATA\\Float', value);
            helpers.logMessage(`(GMST) set ${editorID} to ${value}`);
        }
    };
};