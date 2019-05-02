import { removeMagicSchool } from '../utils';

export default function spellPatcher(patchFile, locals) {
  return {
    load: {
      signature: 'SPEL',
      filter: spell => {
        if (!locals.useMage) return false;
        const type = xelib.GetValue(spell, 'SPIT\\Type');
        const castType = xelib.GetValue(spell, 'SPIT\\Cast Type');
        return type === 'Ability' || castType === 'Constant Effect';
      },
    },
    patch: spell => {
      removeMagicSchool(spell, patchFile);
    },
  };
}
