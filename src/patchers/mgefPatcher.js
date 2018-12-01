import Shout from '../model/shout';

// TODO SkyProc code didn't check for useMage, but it might make sense here
export default function mgefPatcher(helpers, locals) {
  const log = (message) => helpers.logMessage(`(MGEF) ${message}`);

  const isDisarmEffect = function (record) {
    return xelib.GetValue(record, 'Magic Effect Data\\DATA\\Archtype') === 'Disarm';
  };

  const addDisarmConditions = function (record) {
    xelib.AddCondition(record, 'WornHasKeyword', locals.conditionTypes.EqualToOr, '0', locals.KYWD.xMAWeapSchoolLightWeaponry);
    xelib.AddCondition(record, 'HasPerk', locals.conditionTypes.EqualToOr, '0', locals.PERK.xMALIASecureGrip);
  };

  const addShoutExperienceScript = function (shout) {
    const vmad = xelib.AddElement(shout.record, 'VMAD');
    xelib.SetIntValue(vmad, 'Version', 5);
    xelib.SetIntValue(vmad, 'Object Format', 2);
    xelib.AddElement(vmad, 'Scripts');

    const script = xelib.AddScript(shout.record, 'xMATHIShoutExpScript', 'Local');

    const shoutExperienceBaseProperty = xelib.AddScriptProperty(script, 'xMATHIShoutExpBase', 'Object', 'Edited');
    xelib.SetValue(shoutExperienceBaseProperty, 'Value\\Object Union\\Object v2\\FormID', locals.GLOB.xMATHIShoutExpBase);
    xelib.SetValue(shoutExperienceBaseProperty, 'Value\\Object Union\\Object v2\\Alias', 'None');

    const playerRefProperty = xelib.AddScriptProperty(script, 'playerref', 'Object', 'Edited');
    xelib.SetValue(playerRefProperty, 'Value\\Object Union\\Object v2\\FormID', locals.playerRefFormID);
    xelib.SetValue(playerRefProperty, 'Value\\Object Union\\Object v2\\Alias', 'None');

    const expFactorProperty = xelib.AddScriptProperty(script, 'expFactor', 'Float', 'Edited');
    // TODO looks like T3ndo meant to calculate this
    xelib.SetFloatValue(expFactorProperty, 'Float', 1);
  };

  return {
    load: {
      signature: 'MGEF',
      filter: record => isDisarmEffect(record) || xelib.HasKeyword(record, locals.KYWD.MagicShout)
    },
    patch: record => {
      const name = xelib.FullName(record);
      if (isDisarmEffect(record)) {
        xelib.AddKeyword(record, 'xMAMagicDisarm');
        addDisarmConditions(record, helpers);
        log(`patched disarm effect: ${name}`);
      }
      if (xelib.HasKeyword(record, locals.KYWD.MagicShout)) {
        const shout = new Shout(record);
        shout.addKeyword(locals.KYWD);
        addShoutExperienceScript(shout);
        log(`patched shout: ${name}`);
      }
    }
  };
}
