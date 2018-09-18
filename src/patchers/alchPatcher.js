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
        xelib.GetElements(record, 'Effects').forEach(effect => {
            const duration = xelib.GetFloatValue(effect, 'EFIT - \\Duration');
            const magnitude = xelib.GetFloatValue(effect, 'EFIT - \\Duration');

            const mgef = getLinkedMagicEffect(effect, patchFile);
            const alchemyEffect = getAlchemyEffect(mgef);
            if (alchemyEffect) {
                const cost = xelib.GetFloatValue(mgef, 'Magic Effect Data\\DATA - Data\\Base Cost');
            }
        });
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
