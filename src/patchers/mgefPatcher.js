const mgefPatcher = function() {
    class MagicEffect {
        constructor(record) {
            this.record = record;
            this.name = xelib.Name(record);
            this.archetype = xelib.GetValue(this.record, 'Magic Effect Data\\DATA\\Archtype');
        }

        static get HARMFUL_SHOUT_ARCHETYPES() {
            return ['Absorb', 'Value Mod', 'Dual Value Mod'];
        }

        get isDisarm() {
            return this.archetype === 'Disarm';
        }

        get isShout() {
            // TODO: get actual keyword
            return xelib.HasKeyword(this.record, 'ShoutEffect');
        }

        get isHarmfulShout() {
            return this.isShout 
                && MagicEffect.HARMFUL_SHOUT_ARCHETYPES.includes(this.archetype) 
                && xelib.GetFlag(this.record, 'Magic Effect Data\\DATA\\Flags\\Detrimental'); // TODO: ensure this works
        }

        get isSummoningShout() {
            // TODO: check actual keyword
            return this.isShout && this.archetype === 'Summon Creature';
        }
    }

    let addDisarmConditions = function(magicEffect, helpers) {
        // TODO: get actual Function name
        // TODO: ensure Type is correct
        let condition1 = xelib.AddCondition(magicEffect.record, 'WornHasKeyword', '00010000', '0');
        // TODO: PerMa form ID
        xelib.SetValue(condition, 'CTDA\\Parameter #1', '2b222c');

        let condition2 = xelib.AddCondition(recipe.record, 'HasPerk', '00010000', '0');
        // TODO: PerMa form ID
        xelib.SetValue(condition, 'CTDA\\Parameter #1', '3960f9');

        helpers.logMessage(`Added WornHasKeyword and HasPerk conditions to disarm effect: ${magicEffect.name}`);
    };

    let patchShout = function(magicEffect, helpers) {
        if (magicEffect.isHarmfulShout) {
            // TODO: get PerMa keyword
            xelib.AddKeyword(magicEffect.record, 'ShoutHarmful');
            helpers.logMessage(`${magicEffect.name} marked as harmful shout`);
        } else if (magicEffect.isSummoningShout) {
            // TODO: get PerMa keyword
            xelib.AddKeyword(magicEffect.record, 'ShoutSummoning');
            helpers.logMessage(`${magicEffect.name} marked as summoning shout`);
        } else {
            // TODO: get PerMa keyword
            xelib.AddKeyword(magicEffect.record, 'ShoutNonHarmful');
            helpers.logMessage(`${magicEffect.name} marked as non-harmful shout`);
        }

        // TODO: get correct script name and Flags value
        let script = xelib.AddScript(magicEffect.record, 'ShoutExpScriptName', 'Flags');

        // TODO: Type, Flags, 
        let scriptPropertyq = xelib.AddScriptProperty(script, 'xMATHIShoutExpBase', 'Type', 'Flags'); 
        // TODO: path, PerMa form ID
        xelib.SetValue(scriptProperty, 'DATA\\?', '44251b');

        // TODO: Type, Flags, 
        let scriptProperty2 = xelib.AddScriptProperty(script, 'playerref', 'Type', 'Flags'); 
        // TODO: path, PerMa form ID
        xelib.SetValue(scriptProperty, 'DATA\\?', '000014');

        // TODO: Type, Flags, 
        let scriptProperty3 = xelib.AddScriptProperty(script, 'expFactor', 'Type', 'Flags'); 
        // TODO: path, PerMa form ID
        // NOTE: value of 1 is hardcoded in PerMa but was meant to be calculated
        xelib.SetValue(scriptProperty, 'DATA\\?', '1');
    };

    return {
        load: function(plugin, helpers, settings, locals) {
            return {
                signature: 'MGEF',
                filter: function(record) {
                    let magicEffect = new MagicEffect(record);                    
                    return magicEffect.isDisarm || magicEffect.isShout;
                }
            }
        },
        patch: function(record, helpers, settings, locals) {
            let magicEffect = new MagicEffect(record);
            // TODO: Fix this logic. The else if's should be nested under isShout
            if (magicEffect.isDisarm) {
                // TODO: get PerMa keyword
                xelib.AddKeyword(magicEffect.record, 'MagicDisarm'); 
                addDisarmConditions(magicEffect, helpers);
            } else if (magicEffect.isShout) {
                patchShout(magicEffect, helpers);
            }
        }
    };
};