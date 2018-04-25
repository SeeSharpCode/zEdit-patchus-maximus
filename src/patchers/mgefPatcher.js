let mgefPatcher = function() {
    class MagicEffect {
        constructor(record) {
            this.record = record;
            this.name = xelib.Name(record);
            this.archtype = xelib.GetValue(this.record, "Magic Effect Data\\DATA\\Archtype");
        }

        get isDisarm() {
            return xelib.GetValue(this.record, "Magic Effect Data\\DATA\\Archtype") === "Disarm";
        }
    }

    return {
        load: function(plugin, helpers, settings, locals) {
            return {
                signature: 'MGEF',
                filter: function(record) {
                    let magicEffect = new MagicEffect(record);
                    helpers.logMessage(`${magicEffect.archtype} is disarm!`);
                    return false;
                }
            }
        },
        patch: function(record, helpers, settings, locals) {
            
        }
    };
};