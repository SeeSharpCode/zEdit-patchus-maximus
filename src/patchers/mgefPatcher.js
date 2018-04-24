let mgefPatcher = function() {
    class MagicEffect {
        constructor(record) {
            this.record = record;
            this.name = xelib.Name(record);
        }

        get isDisarm() {
            return xelib.GetValue(this.record, "DATA\\EffectType") === "9";
        }
    }

    return {
        load: function(plugin, helpers, settings, locals) {
            return {
                signature: 'MGEF',
                filter: function(record) {
                    let magicEffect = new MagicEffect(record);
                    helpers.logMessage(`${magicEffect.name} is disarm!`);
                    return false;
                }
            }
        },
        patch: function(record, helpers, settings, locals) {
            
        }
    };
};