import { removeMagicSchool } from '../util';

export default function alchPatcher(patchFile, locals) {
    const isExcluded = function(record) {
        const editorIDExcluded = locals.exclusionPatterns.alch.editorIDs.find(expr => expr.test(xelib.EditorID(record)));
        if (editorIDExcluded) return false;

        const nameExcluded = locals.exclusionPatterns.alch.names.find(expr => expr.test(xelib.Name(record)));
        return nameExcluded;
    };

    return {
        load: {
            signature: 'ALCH',
            filter: record => locals.useThief
        },
        patch: record => {
            // if (!isExcluded(record)) {

            // }

            removeMagicSchool(record, patchFile);
        }
    };
}
