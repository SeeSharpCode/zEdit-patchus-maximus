import { removeMagicSchool } from '../utils';

export default function enchPatcher(patchFile, locals) {
  return {
    load: {
      signature: 'ENCH',
      filter: ench => {
        if (!locals.useMage) return false;
        const type = xelib.GetValue(ench, 'ENIT\\Enchant Type');
        const castType = xelib.GetValue(ench, 'ENIT\\Cast Type');
        return type === 'Ability' || castType === 'Constant Effect';
      },
    },
    patch: ench => {
      removeMagicSchool(ench, patchFile);
    },
  };
}
