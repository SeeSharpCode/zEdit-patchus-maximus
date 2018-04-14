/* global ngapp, xelib */
registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'Cell Encounter Levels In Name',
        templateUrl: `${patcherPath}/partials/settings.html`,
        defaultSettings: {
            formulaRangedLeveled: '{name} [{min} ~ {max}]',
            formulaDeleveled: '{name} [{min}]',
            formulaLeveled: '{name} [{min}+]',
            patchFileName: 'PatchusMaximus.esp'
        }
    },
    requiredFiles: [],
    getFilesToPatch: function(filenames) {
        return filenames;
    },
    execute: {
        process: [{
            load: function(plugin, helpers, settings, locals) {
                return {
                    signature: 'WEAP',
                    filter: function(record) {
                        var isMace = xelib.HasKeyword(record, 'WeapTypeMace');
                        helpers.logMessage(xelib.FullName(record) + ": " + isMace);
                        return isMace;
                    }
                }
                // return {
                //     signature: 'CELL',
                //     filter: function(record) {
                //         return xelib.HasElement(record, 'FULL') && xelib.HasElement(record, 'XEZN') && xelib.GetFlag(record, 'DATA', 'Is Interior Cell');
                //     }
                // }
            },
            patch: function(record, helpers, settings, locals) {
                let name = xelib.FullName(record);
                helpers.logMessage(name);
            }
        }]
    }
});