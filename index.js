/* global xelib, fh, patcherUrl, patcherPath */

import globPatcher from './src/patchers/globPatcher';
import cobjPatcher from './src/patchers/cobjPatcher';
import gmstPatcher from './src/patchers/gmstPatcher';
import mgefPatcher from './src/patchers/mgefPatcher';
import npcPatcher from './src/patchers/npcPatcher';
import racePatcher from './src/patchers/racePatcher';
import spellPatcher from './src/patchers/spellPatcher';
import enchPatcher from './src/patchers/enchPatcher';
import alchPatcher from './src/patchers/alchPatcher';

const buildReferenceMaps = function(locals) {
    const signaturesToMap = ['MISC', 'KYWD', 'PERK', 'GLOB', 'SPEL'];
    signaturesToMap.forEach(sig => {
        const records = xelib.GetRecords(0, sig, false);
        locals[sig] = records.reduce((obj, rec) => {
            const edid = xelib.EditorID(rec);
            if (edid) obj[edid] = xelib.GetHexFormID(rec);
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

const buildExclusionPatterns = function(locals) {
    locals.npcExclusions = locals.npcExclusions.map(e => new RegExp(e));
    locals.potionExclusions.editorID = locals.potionExclusions.editorID.map(e => new RegExp(e));
    locals.potionExclusions.name = locals.potionExclusions.name.map(e => new RegExp(e));
};

const detectPerMaModules = function(helpers, locals) {
    const perMaFileNamePrefix = 'PerkusMaximus_';
    const perMaModules = ['Mage', 'Warrior', 'Thief'];

    perMaModules.forEach(module => {
        const moduleFileName = `${perMaFileNamePrefix}${module}.esp`;
        const isLoaded = xelib.GetLoadedFileNames().find(fileName => fileName === moduleFileName);

        if (isLoaded) {
            locals[`use${module}`] = true;
        } else {
            helpers.logMessage(`Warning: ${module} module not detected. ${module} changes will not be made.`);
        }
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
        initialize: () => {
            locals.conditionTypes = {
                EqualTo: '10000000',
                EqualToOr: '10010000'
            };

            loadConfiguration(locals);
            buildExclusionPatterns(locals);
            buildReferenceMaps(locals);
            detectPerMaModules(helpers, locals);

            locals.playerFormID = '00000007';
            locals.playerRefFormID = '00000014';
        },
        process: [
            // globPatcher(helpers, locals),
            // gmstPatcher(helpers, locals),
            // cobjPatcher(helpers, locals),
            // mgefPatcher(helpers, locals),
            // npcPatcher(helpers, locals),
            // racePatcher(locals),
            // spellPatcher(patch, locals),
            // enchPatcher(patch, locals),
            alchPatcher(patch, locals)
        ]
    })
});
