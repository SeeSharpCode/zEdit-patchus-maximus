import { getLinkedRecord, removeMagicSchool } from '../utils';
import { isExcludedFromPatching } from '../exclusions';
import { getIngredientVariation, getAlchemyEffect } from '../config';

export default function ingrPatcher(patchFile, locals) {
  const makeIngredientEffectGradual = function (effect, recordName) {
    const mgef = getLinkedRecord(effect, 'EFID', patchFile);
    const alchemyEffect = getAlchemyEffect(xelib.FullName(mgef));
    if (!alchemyEffect) return;

    let newDuration = alchemyEffect.baseDuration;
    let newMagnitude = alchemyEffect.baseMagnitude;

    if (alchemyEffect.allowIngredientVariation) {
      const ingredientVariation = getIngredientVariation(recordName);
      if (ingredientVariation) {
        newDuration *= ingredientVariation.multiplierDuration;
        newMagnitude *= ingredientVariation.multiplierMagnitude;
      }
    }

    // TODO only change if new value != old value
    xelib.SetFloatValue(effect, 'EFIT\\Duration', newDuration);
    xelib.SetFloatValue(effect, 'EFIT\\Magnitude', newMagnitude);
  };

  return {
    load: {
      signature: 'INGR',
      /* eslint no-unused-vars: off */
      filter: record => locals.useThief,
    },
    patch: record => {
      removeMagicSchool(record, patchFile);
      if (isExcludedFromPatching(record)) return;
      xelib.GetElements(record, 'Effects').forEach(effect => makeIngredientEffectGradual(effect, xelib.FullName(record)));
    },
  };
}
