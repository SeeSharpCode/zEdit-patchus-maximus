import conditionOperators from '../model/conditionOperators';

// TODO SkyProc code didn't check for useMage, but it might make sense here
export default function mgefPatcher(helpers, locals) {
  const HARMFUL_SHOUT_ARCHETYPES = ['Value Modifier', 'Peak Value Modifier', 'Dual Value Modifier'];

  const log = (message) => helpers.logMessage(`(MGEF) ${message}`);

  const isDisarmEffect = mgef => xelib.GetValue(mgef, 'Magic Effect Data\\DATA\\Archtype') === 'Disarm';

  const addDisarmConditions = mgef => {
    xelib.AddCondition(mgef, 'WornHasKeyword', conditionOperators.equalToOr, '0', locals.KYWD.xMAWeapSchoolLightWeaponry);
    xelib.AddCondition(mgef, 'HasPerk', conditionOperators.equalToOr, '0', locals.PERK.xMALIASecureGrip);
  };

  const addShoutExperienceScript = mgef => {
    const vmad = xelib.AddElement(mgef, 'VMAD');
    xelib.SetIntValue(vmad, 'Version', 5);
    xelib.SetIntValue(vmad, 'Object Format', 2);
    xelib.AddElement(vmad, 'Scripts');

    const script = xelib.AddScript(mgef, 'xMATHIShoutExpScript', 'Local');

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

  const addShoutKeyword = mgef => {
    const archetype = xelib.GetValue(mgef, 'Magic Effect Data\\DATA - Data\\Archtype');
    const isHarmful = HARMFUL_SHOUT_ARCHETYPES.includes(archetype)
      && xelib.GetFlag(mgef, 'Magic Effect Data\\DATA - Data\\Flags', 'Detrimental');

    if (isHarmful) {
      xelib.AddKeyword(mgef, locals.KYWD.xMASPEShoutHarmful);
    } else if (archetype === 'Summon Creature') {
      xelib.AddKeyword(mgef, locals.KYWD.xMASPEShoutSummoning);
    } else {
      xelib.AddKeyword(mgef, locals.KYWD.xMASPEShoutNonHarmful);
    }
  };

  return {
    load: {
      signature: 'MGEF',
      filter: mgef => isDisarmEffect(mgef) || xelib.HasKeyword(mgef, locals.KYWD.MagicShout),
    },
    patch: mgef => {
      const name = xelib.FullName(mgef);
      if (isDisarmEffect(mgef)) {
        xelib.AddKeyword(mgef, 'xMAMagicDisarm');
        addDisarmConditions(mgef);
        log(`patched disarm effect: ${name}`);
      }
      if (xelib.HasKeyword(mgef, locals.KYWD.MagicShout)) {
        addShoutKeyword(mgef);
        addShoutExperienceScript(mgef);
        log(`patched shout: ${name}`);
      }
    },
  };
}
