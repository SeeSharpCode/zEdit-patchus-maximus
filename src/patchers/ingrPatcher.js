import { getLinkedRecord, removeMagicSchool, getItemBySubstring } from '../util';

export default function ingrPatcher(patchFile, locals) {
    const isExcluded = function(record) {
        return locals.ingredientExclusions.find(expr => expr.test(xelib.EditorID(record)));
    };

    const makeIngredientEffectGradual = function(effect, recordName) {
        const mgef = getLinkedRecord(effect, 'EFID', patchFile);
        const alchemyEffect = getItemBySubstring(locals.alchemyEffects, xelib.FullName(mgef));
        if (!alchemyEffect || !alchemyEffect.allowIngredientVariation) return;

        const ingredientVariation = getItemBySubstring(locals.ingredientVariations, recordName);
        if (!ingredientVariation) return;

        // const oldDuration = xelib.GetFloatValue(effect, 'EFIT - \\Duration');
        // const oldMagnitude = xelib.GetFloatValue(effect, 'EFIT - \\Duration');
        const newDuration = alchemyEffect.baseDuration * ingredientVariation.multiplierDuration;
        const newMagnitude = alchemyEffect.baseMagnitude * ingredientVariation.multiplierMagnitude;

        // TODO only change if new value != old value
        xelib.SetFloatValue(effect, 'EFIT - \\Duration', newDuration);
        xelib.SetFloatValue(effect, 'EFIT - \\Magnitude', newMagnitude);
    };

    return {
        load: {
            signature: 'INGR',
            filter: record => locals.useThief
        },
        patch: record => {
            removeMagicSchool(record, patchFile);

            if (!isExcluded(record)) {
                xelib.GetElements(record, 'Effects').forEach(effect => makeIngredientEffectGradual(effect, xelib.FullName(record)));
            }
        }
    };
}
