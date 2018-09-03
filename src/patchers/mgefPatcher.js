const mgefPatcher = function(helpers, settings, locals) {
    const log = (message) => helpers.logMessage(`(MGEF) ${message}`);

    class Shout {
        constructor(record) {
            this.editorID = xelib.EditorID(record);
            this.record = record;
            this.archetype = xelib.GetValue(this.record, 'Magic Effect Data\\DATA - Data\\Archtype');
        }

        static get HARMFUL_SHOUT_ARCHETYPES() {
            return ['Absorb', 'Value Modifier', 'Dual Value Modifier'];
        }

        get isHarmful() {
            return Shout.HARMFUL_SHOUT_ARCHETYPES.includes(this.archetype) 
                && xelib.GetFlag(this.record, 'Magic Effect Data\\DATA - Data\\Flags', 'Detrimental'); // TODO: ensure this works
        }

        get isSummoning() {
            // TODO: check actual keyword
            return this.archetype === 'Summon Creature';
        }

        addKeyword() {
            let keyword = "";
            if (this.isHarmful) {
                keyword = 'xMASPEShoutHarmful';
            } else if (this.isSummoningShout) {
                keyword = 'xMASPEShoutSummoning';
            } else {
                keyword = 'xMASPEShoutNonHarmful';
            }
            xelib.AddKeyword(this.record, keyword);
        }
    }

    const isDisarmEffect = function(record) { 
        return xelib.GetValue(record, 'Magic Effect Data\\DATA\\Archtype') === 'Disarm'; 
    }

    const addDisarmConditions = function(record) {
        xelib.AddCondition(record, 'WornHasKeyword', locals.conditionTypes.EqualToOr, 
            '0', xelib.GetHexFormID(locals.KYWD['xMAWeapSchoolLightWeaponry']));
        xelib.AddCondition(record, 'HasPerk', locals.conditionTypes.EqualToOr, 
            '0', xelib.GetHexFormID(locals.PERK['xMALIASecureGrip']));
    };

    const addScriptToShout = function(shout, helpers) {
        // TODO: get correct script name and Flags value
        const script = xelib.AddScript(shout.record, 'ShoutExpScriptName', 'Flags');

        // TODO: Type, Flags, 
        const scriptProperty1 = xelib.AddScriptProperty(script, 'xMATHIShoutExpBase', 'Type', 'Flags'); 
        // TODO: path, PerMa form ID
        xelib.SetValue(scriptProperty1, 'DATA\\?', '44251b');

        // TODO: Type, Flags, 
        const scriptProperty2 = xelib.AddScriptProperty(script, 'playerref', 'Type', 'Flags'); 
        // TODO: path, PerMa form ID
        xelib.SetValue(scriptProperty2, 'DATA\\?', '000014');

        // TODO: Type, Flags, 
        const scriptProperty3 = xelib.AddScriptProperty(script, 'expFactor', 'Type', 'Flags'); 
        // TODO: path, PerMa form ID
        // NOTE: value of 1 is hardcoded in PerMa but was meant to be calculated
        xelib.SetValue(scriptProperty2, 'DATA\\?', '1');
    };

    return {
        load: {
            signature: 'MGEF',
            filter: function(record) {
                return isDisarmEffect(record) || xelib.HasKeyword(record, 'MagicShout');
            }
        },
        patch: function(record) {
            const name = xelib.Name(record);
            if (isDisarmEffect(record)) {
                xelib.AddKeyword(record, 'xMAMagicDisarm'); 
                addDisarmConditions(record, helpers);
                log(`patched disarm effect: ${name}`);
            } else {
                const shout = new Shout(record);
                shout.addKeyword();
                // addScriptToShout(shout);
                log(`patched shout: ${name}`);
            }
        }
    };
};