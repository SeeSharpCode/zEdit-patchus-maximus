import { getLinkedMagicEffect, removeMagicSchool, getItemBySubstring } from '../util';

export default function ingrPatcher(patchFile, locals) {
    const isExcluded = function(record) {
        return locals.ingredientExclusions.find(expr => expr.test(xelib.EditorID(record)));
    };

    const getAlchemyEffect = function(mgef) {
        const name = xelib.FullName(mgef);
        return locals.alchemyEffects.find(e => e.name === name) || getItemBySubstring(locals.alchemyEffects, name);
    };

    const addDurationToDescription = function(mgef) {
        const mgefDescription = xelib.GetValue(mgef, 'DNAM - Magic Item Description');
        if (!mgefDescription.includes('<dur>')) {
            xelib.SetFlag(mgef, 'Magic Effect Data\\DATA - Data\\Flags', 'No Duration', false);
            const newDescription = `${mgefDescription} [Duration: <dur> seconds]`;
            xelib.SetValue(mgef, 'DNAM - Magic Item Description', newDescription);
        }
    };

    const makeIngredientEffectGradual = function(effect, recordName) {
        const mgef = getLinkedMagicEffect(effect, patchFile);
        const alchemyEffect = getAlchemyEffect(mgef);
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
