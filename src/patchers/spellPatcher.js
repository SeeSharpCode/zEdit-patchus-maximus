import { removeMagicSchool } from '../utils';

export default function spellPatcher(patchFile, locals) {
  return {
    load: {
      signature: 'SPEL',
      filter: spell => {
        if (!locals.useMage) return false;
        const type = xelib.GetValue(spell, 'SPIT - Data\\Type');
        const castType = xelib.GetValue(spell, 'SPIT - Data\\Cast Type');
        return type === 'Ability' || castType === 'Constant Effect';
      },
    },
    patch: record => {
      removeMagicSchool(record, patchFile);
    },
  };
}
