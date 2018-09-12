export default function spellPatcher(locals) {
    return {
        load: {
            signature: 'SPEL',
            filter: record => {
                if (!locals.useMage) return false;
                
            }
        },
        patch: record => {
            
        }
    };
}
