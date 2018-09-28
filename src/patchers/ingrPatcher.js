import { getLinkedRecord, removeMagicSchool } from '../util';

export default function ingrPatcher(patchFile, locals, configService) {
    const makeIngredientEffectGradual = function(effect, recordName) {
        const mgef = getLinkedRecord(effect, 'EFID', patchFile);
        const alchemyEffect = configService.getAlchemyEffect(xelib.FullName(mgef));
        if (!alchemyEffect) return;

        let newDuration = alchemyEffect.baseDuration;
        let newMagnitude = alchemyEffect.baseMagnitude;

        if (alchemyEffect.allowIngredientVariation) {
            const ingredientVariation = configService.getIngredientVariation(recordName);
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
            if (configService.isExcluded(record)) return;
            xelib.GetElements(record, 'Effects').forEach(effect => makeIngredientEffectGradual(effect, xelib.FullName(record)));
        }
    };
}
