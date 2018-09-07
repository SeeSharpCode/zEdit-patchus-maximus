/* global ngapp, xelib, fh, patcherUrl, patcherPath */
//=require src/polyfills.js
//=require src/patchers/*.js

const signaturesToMap = ['MISC', 'KYWD', 'PERK', 'GLOB', 'SPEL'];

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

            locals.passiveScalingSpellsPerkFormID = xelib.GetHexFormID(locals.PERK['xMAMAGPassiveScalingSpells']);
            locals.passiveEffectsPerkFormID = xelib.GetHexFormID(locals.PERK['xMAMAGPassiveEffects']);
            locals.alchemySkillBoostsPerkFormID = xelib.GetHexFormID(locals.PERK['AlchemySkillBoosts']);
            locals.thiefModuleCombatAbilityFormID = xelib.GetHexFormID(locals.SPEL['xMATHICombatAbility']);
            locals.scarredPassivePerkFormID = xelib.GetHexFormID(locals.PERK['xMAHEWScarredPassive']);
            locals.passiveScalingFistPerkFormID = xelib.GetHexFormID(locals.PERK['xMAWARPassiveScalingFistWeapon']);
            locals.shieldTypeDetectorAbilitySpellFormID = xelib.GetHexFormID(locals.SPEL['xMAWARShieldTypeDetectorAbility']);
            locals.passiveScalingCriticalDamagePerkFormID = xelib.GetHexFormID(locals.PERK['xMAWARPassiveScalingCriticalDamage']);
            locals.passiveCrossbowEffectsPerkFormID = xelib.GetHexFormID(locals.PERK['xMAWARPassiveCrossbowEffects']);

            locals.npcExclusions = locals.npcExclusions.map(e => new RegExp(e));
        },
        process: [
            //gameSettingsPatcher(helpers, settings, locals),
            //cobjPatcher(helpers, settings, locals),
            //mgefPatcher(helpers, settings, locals),
            npcPatcher(helpers, settings, locals)
        ]
    })
});