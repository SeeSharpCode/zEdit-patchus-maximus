/* eslint no-unused-vars: off */
/* global xelib, fh, patcherUrl, patcherPath */

// TODO export everything from the patchers folder
import globPatcher from './src/patchers/globPatcher';
import cobjPatcher from './src/patchers/cobjPatcher';
import gmstPatcher from './src/patchers/gmstPatcher';
import mgefPatcher from './src/patchers/mgefPatcher';
import npcPatcher from './src/patchers/npcPatcher';
import racePatcher from './src/patchers/racePatcher';
import spellPatcher from './src/patchers/spellPatcher';
import enchPatcher from './src/patchers/enchPatcher';
import alchPatcher from './src/patchers/alchPatcher';
import ingrPatcher from './src/patchers/ingrPatcher';
import bookPatcher from './src/patchers/bookPatcher';

const buildReferenceMaps = function (locals) {
  const signaturesToMap = ['MISC', 'KYWD', 'PERK', 'GLOB', 'SPEL', 'ENCH'];
  signaturesToMap.forEach(sig => {
    const records = xelib.GetRecords(0, sig, false);
    locals[sig] = records.reduce((obj, rec) => {
      const edid = xelib.EditorID(rec);
      if (edid) obj[edid] = xelib.GetHexFormID(rec);
      return obj;
    }, {});
  });
};

const detectPerMaModules = function (helpers, locals) {
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

/* eslint no-undef: off */
registerPatcher({
  /* eslint object-shorthand: off */
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
      // alchPatcher(patch, locals),
      // ingrPatcher(patch, locals),
      bookPatcher(patch, locals, helpers)
    ]
  })
});
