import { getLinkedRecord, removeMagicSchool, getItemBySubstring } from '../util';

export default function ingrPatcher(patchFile, locals) {
    const isExcluded = function(record) {
        return locals.ingredientExclusions.find(expr => expr.test(xelib.EditorID(record)));
    };

    const makeIngredientEffectGradual = function(effect, recordName) {
        const mgef = getLinkedRecord(effect, 'EFID', patchFile);
        const alchemyEffect = getItemBySubstring(locals.alchemyEffects, xelib.FullName(mgef));
        if (!alchemyEffect) return;

        let newDuration = alchemyEffect.baseDuration;
        let newMagnitude = alchemyEffect.baseMagnitude;

        if (alchemyEffect.allowIngredientVariation) {
            const ingredientVariation = getItemBySubstring(locals.ingredientVariations, recordName);
            if (ingredientVariation) {
                newDuration *= ingredientVariation.multiplierDuration;
                newMagnitude *= ingredientVariation.multiplierMagnitude;
            }
        }

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
