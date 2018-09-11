export default function gameSettingsPatcher(helpers, locals) {
    return {
        load: {
            signature: 'GMST',
            filter: (record) => {
                if (!locals.useWarrior) return false;
                const editorID = xelib.EditorID(record);
                return Object.keys(locals.gameSettings).includes(editorID);
            }
        },
        patch: record => {
            const editorID = xelib.EditorID(record);
            const value = locals.gameSettings[editorID];
            xelib.SetFloatValue(record, 'DATA\\Float', value);
            helpers.logMessage(`(GMST) set ${editorID} to ${value}`);
        }
    };
}
