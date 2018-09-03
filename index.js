/* global ngapp, xelib, fh, patcherUrl, patcherPath */
//=require src/polyfills.js
//=require src/patchers/*.js

const signaturesToMap = ['MISC', 'KYWD', 'PERK', 'GLOB'];

const buildReferenceMaps = function(locals) {
    signaturesToMap.forEach(sig => {
        let records = xelib.GetRecords(0, sig, false);
        locals[sig] = records.reduce((obj, rec) => {
            const edid = xelib.EditorID(rec);
            if (edid) obj[edid] = rec;
            return obj;
        }, {});
    });
};

const loadConfiguration = function(locals) {
    fh.jetpack.find(`${patcherPath}/config`, {
        matching: '*.json',
        recursive: false
    }).map(path => fh.jetpack.path(path)).forEach(filePath => {
        const fileName = fh.getFileName(filePath);
        const baseName = fileName.substr(0, fileName.indexOf('.'));
        locals[baseName] = fh.loadJsonFile(filePath);
    });
};

const detectPerMaModules = function(locals) {
    xelib.GetLoadedFileNames().forEach(filename => {
        let match = filename.match(/PerkusMaximus_(?!Master)(\w+)\.esp/);
        if (match) locals[`use${match[1]}`] = true;
    });
};

registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'Patchus Maximus',
        templateUrl: `${patcherUrl}/partials/settings.html`,
        defaultSettings: {
            staffCraftingInclusions: ['ACX', 'Unenchanted']
        }
    },
    requiredFiles: ['PerkusMaximus_Master.esp'],
    execute: (patch, helpers, settings, locals) => ({
        initialize: function() {
            locals.conditionTypes = {
                EqualTo: '10000000',
                EqualToOr: '10010000'
            };
            loadConfiguration(locals);
            buildReferenceMaps(locals);
            detectPerMaModules(locals);
        },
        process: [
            //gameSettingsPatcher(helpers, settings, locals),
            //cobjPatcher(helpers, settings, locals),
            //mgefPatcher(helpers, settings, locals),
            //npcPatcher(helpers, settings, locals)
        ]
    })
});