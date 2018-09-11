export default function globPatcher(helpers, locals) {    
    const log = message => helpers.logMessage(`(GLOB) ${message}`);

    return {
        load: {
            signature: 'GLOB',
            filter: function(record) {
                const editorID = xelib.EditorID(record);
                
                return (locals.useMage && editorID === 'xMAIsPerMaMageRunning') 
                    || (locals.useWarrior && editorID === 'xMAIsPerMaWarriorRunning')
                    || (locals.useThief && editorID === 'xMAIsPerMaThiefRunning');
            }
        },
        patch: function(record) {
            log(`setting ${xelib.EditorID(record)} to true`);
            xelib.SetFloatValue(record, 'FLTV', 1);
        }
    };
};