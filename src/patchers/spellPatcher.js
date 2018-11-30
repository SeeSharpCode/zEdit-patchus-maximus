import { removeMagicSchool } from '../utils';

export default function spellPatcher(patchFile, locals) {
    return {
        load: {
            signature: 'SPEL',
            filter: record => {
                if (!locals.useMage) return false;
                const type = xelib.GetValue(record, 'SPIT - Data\\Type');
                const castType = xelib.GetValue(record, 'SPIT - Data\\Cast Type');
                return type === 'Ability' || castType === 'Constant Effect';
            }
        },
        patch: record => {
            removeMagicSchool(record, patchFile);
        }
    };
}
