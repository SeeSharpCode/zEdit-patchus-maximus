const mgefPatcher = function() {
    class Shout {
        constructor(record) {
            this.record = record;
            this.archetype = xelib.GetValue(this.record, 'Magic Effect Data\\DATA\\Archtype');
        }

        static get HARMFUL_SHOUT_ARCHETYPES() {
            return ['Absorb', 'Value Mod', 'Dual Value Mod'];
        }

        get isHarmful() {
            return Shout.HARMFUL_SHOUT_ARCHETYPES.includes(this.archetype) 
                && xelib.GetFlag(this.record, 'Magic Effect Data\\DATA\\Flags\\Detrimental'); // TODO: ensure this works
        }

        get isSummoning() {
            // TODO: check actual keyword
            return this.archetype === 'Summon Creature';
        }

        addKeyword() {
            let keyword = "";
            if (this.isHarmfulShout) {
                keyword = 'ShoutHarmful';
            } else if (this.isSummoningShout) {
                keyword = 'ShoutSummoning';
            } else {
                keyword = 'ShoutNonHarmful';
            }
            xelib.AddKeyword(magicEffect.record, keyword);
        }
    }

    const isDisarmEffect = function(record) { 
        return xelib.GetValue(record, 'Magic Effect Data\\DATA\\Archtype') === 'Disarm'; 
    }

    const addDisarmConditions = function(record) {
        // TODO: get actual Function name
        // TODO: ensure Type is correct
        const condition1 = xelib.AddCondition(record, 'WornHasKeyword', '00010000', '0');
        // TODO: PerMa form ID
        xelib.SetValue(condition1, 'CTDA\\Parameter #1', '2b222c');

        const condition2 = xelib.AddCondition(record, 'HasPerk', '00010000', '0');
        // TODO: PerMa form ID
        xelib.SetValue(condition2, 'CTDA\\Parameter #1', '3960f9');
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
        load: function(plugin, helpers, settings, locals) {
            return {
                signature: 'MGEF',
                filter: function(record) {    
                    return isDisarmEffect(record) || xelib.HasKeyword(record, 'MagicShout');
                }
            }
        },
        patch: function(record, helpers, settings, locals) {
            const name = xelib.Name(record);
            if (isDisarmEffect(record)) {
                // TODO: get PerMa keyword
                xelib.AddKeyword(record, 'MagicDisarm'); 
                addDisarmConditions(record, helpers);
                helpers.logMessage(`(MGEF) patched disarm effect: ${name}`);
            } else {
                const shout = new Shout(record);
                shout.addKeyword();
                addScriptToShout(shout);
                helpers.logMessage(`(MGEF) patched shout: ${name}`);
            }
        }
    };
};