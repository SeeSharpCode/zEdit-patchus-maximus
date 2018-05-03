const npcPatcher = function() {
    const isExcluded = function(npcRecord, npcExclusions) {
        const editorID = xelib.EditorID(record);
        const name = xelib.Name(record);

        if (npcExclusions.exactMatchExclusions.editorIDs.includes(editorID) || 
            npcExclusions.exactMatchExclusions.names.includes(name)) {
                return true;
        }
        npcExclusions.partialMatchExclusions.editorIDs.forEach(excludedEditorID => {
            if (editorID.contains(excludedEditorID)) {
                return true;
            }
        });    
        npcExclusions.partialMatchExclusions.names.forEach(excludedName => {
            if (editorID.contains(excludedName)) {
                return true;
            }
        }); 
        return false;
    }

    return {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'NPC_',
                filter: function (record) {
                    return !isExcluded(record);
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