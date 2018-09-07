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
                && xelib.GetFlag(this.record, 'Magic Effect Data\\DATA - Data\\Flags', 'Detrimental'); // TODO ensure this works
        }

        get isSummoning() {
            return this.archetype === 'Summon Creature';
        }

        addKeyword() {
            let keyword = "";
            if (this.isHarmful) {
                keyword = 'xMASPEShoutHarmful';
            } else if (this.isSummoning) {
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
        xelib.AddCondition(record, 'WornHasKeyword', locals.conditionTypes.EqualToOr, '0', locals.KYWD.xMAWeapSchoolLightWeaponry);
        xelib.AddCondition(record, 'HasPerk', locals.conditionTypes.EqualToOr, '0', locals.PERK.xMALIASecureGrip);
    };

    const addShoutExperienceScript = function(shout) {
        const vmad = xelib.AddElement(shout.record, 'VMAD');
        xelib.SetIntValue(vmad, 'Version', 5);
        xelib.SetIntValue(vmad, 'Object Format', 2);
        xelib.AddElement(vmad, 'Scripts');

        const script = xelib.AddScript(shout.record, 'xMATHIShoutExpScript', 'Local');

        const shoutExperienceBaseProperty = xelib.AddScriptProperty(script, 'xMATHIShoutExpBase', 'Object', 'Edited'); 
        xelib.SetValue(shoutExperienceBaseProperty, 'Value\\Object Union\\Object v2\\FormID', locals.GLOB.xMATHIShoutExpBase);
        xelib.SetValue(shoutExperienceBaseProperty, 'Value\\Object Union\\Object v2\\Alias', 'None');

        const playerRefProperty = xelib.AddScriptProperty(script, 'playerref', 'Object', 'Edited'); 
        xelib.SetValue(playerRefProperty, 'Value\\Object Union\\Object v2\\FormID', '00000014');
        xelib.SetValue(playerRefProperty, 'Value\\Object Union\\Object v2\\Alias', 'None');

        const expFactorProperty = xelib.AddScriptProperty(script, 'expFactor', 'Float', 'Edited'); 
        // TODO looks like T3ndo meant to calculate this
        xelib.SetFloatValue(expFactorProperty, 'Float', 1);
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
                addShoutExperienceScript(shout);
                log(`patched shout: ${name}`);
            }
        }
    };
};