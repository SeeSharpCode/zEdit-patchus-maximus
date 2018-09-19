import { getLinkedMagicEffect, removeMagicSchool, getItemBySubstring } from '../util';

export default function alchPatcher(patchFile, locals) {
    const isExcluded = function(record) {
        const editorIDExcluded = locals.alchemyExclusions.editorID.find(expr => expr.test(xelib.EditorID(record)));
        if (editorIDExcluded) return false;

        const nameExcluded = locals.alchemyExclusions.name.find(expr => expr.test(xelib.Name(record)));
        return nameExcluded;
    };

    const getAlchemyEffect = function(mgef) {
        const name = xelib.Name(mgef);
        return locals.alchemyEffects.find(e => e.name === name) || getItemBySubstring(locals.alchemyEffects, name);
    };

    const makePotionEffectsGradual = function(record) {
        /* eslint no-restricted-syntax: off, no-continue: off */
        for (const effect of xelib.GetElements(record, 'Effects')) {
            const mgef = getLinkedMagicEffect(effect, patchFile);
            const alchemyEffect = getAlchemyEffect(mgef);
            if (!alchemyEffect || !alchemyEffect.allowPotionMultiplier) continue;

            const potionMultiplier = getItemBySubstring(locals.potionMultipliers, xelib.Name(record));
            if (!potionMultiplier) continue;

            // const oldDuration = xelib.GetFloatValue(effect, 'EFIT - \\Duration');
            const newDuration = alchemyEffect.baseDuration * potionMultiplier.multiplierDuration;
            // const oldMagnitude = xelib.GetFloatValue(effect, 'EFIT - \\Duration');
            const newMagnitude = alchemyEffect.baseMagnitude * potionMultiplier.multiplierMagnitude;
            // const oldCost = xelib.GetFloatValue(mgef, 'Magic Effect Data\\DATA - Data\\Base Cost');
            const newCost = alchemyEffect.baseCost;

            const mgefDescription = xelib.GetValue(mgef, 'DNAM - Magic Item Description');
            if (!mgefDescription.includes('<dur>')) {
                xelib.SetFlag(mgef, 'Magic Effect Data\\DATA - Data\\Flags', 'No Duration', false);
                const newDescription = `${mgefDescription} [Duration: <dur> seconds]`;
                xelib.SetValue(mgef, 'DNAM - Magic Item Description', newDescription);
            }

            xelib.SetFloatValue(effect, 'EFIT - \\Duration', newDuration);
            xelib.SetFloatValue(effect, 'EFIT - \\Magnitude', newMagnitude);
            xelib.SetFloatValue(mgef,'Magic Effect Data\\DATA - Data\\Base Cost', newCost);
        }
    };

    return {
        load: {
            signature: 'ALCH',
            filter: record => locals.useThief
        },
        patch: record => {
            removeMagicSchool(record, patchFile);

            if (!isExcluded(record)) {
                makePotionEffectsGradual(record);
            }
        }
    };
}
