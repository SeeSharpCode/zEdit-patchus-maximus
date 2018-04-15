const gameSettings = {
    fArmorScalingFactor: .1,
    fMaxArmorRating: 90.0,
    fArmorRatingMax: 1.75,
    fArmorRatingPCMax: 1.4
};

let gameSettingsKeys = Object.keys(gameSettings);

// TODO: if useWarrior
patchers.push({
    load: function (plugin, helpers, settings, locals) {
        return {
            signature: 'GMST',
            filter: function (record) {
                let editorId = xelib.EditorID(record);
                return gameSettingsKeys.indexOf(editorId) > -1;
            }
        }
    },
    patch: function (record, helpers, settings, locals) {
        let editorId = xelib.EditorID(record);
        let value = gameSettings[editorId];
        helpers.logMessage(`Setting ${editorId} to ${value}`);
        xelib.SetFloatValue(record, 'DATA\\Float', value);
    }
});