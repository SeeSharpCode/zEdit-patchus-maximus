import ingredientExclusions from '../config/alchemy/ingredientExclusions.json';
import potionExclusions from '../config/alchemy/potionExclusions.json';
import npcExclusions from '../config/npcExclusions.json';
import staffCraftingExclusions from '../config/staffCraftingExclusions.json';

let patchingExclusions = [ingredientExclusions, potionExclusions, npcExclusions];

patchingExclusions = patchingExclusions.reduce((result, exclusion) => {
    result[exclusion.recordSignature] = {
        editorIDPatterns: exclusion.editorIDs.map(editorID => new RegExp(editorID)),
        namePatterns: exclusion.names.map(name => new RegExp(name))
    };

    return result;
});

export function isExcludedFromPatching(record) {
    const signature = xelib.Signature(record);
    const { editorIDPatterns, namePatterns } = patchingExclusions[signature];
    return (editorIDPatterns && editorIDPatterns.some(p => p.test(xelib.EditorID(record))))
        || (namePatterns && namePatterns.some(p => p.test(xelib.FullName(record))));
}

const staffCraftingExclusionPatterns = staffCraftingExclusions.map(e => new RegExp(e));

export function isExcludedFromStaffCrafting(editorID) {
    return staffCraftingExclusionPatterns.some(p => p.test(editorID));
}
