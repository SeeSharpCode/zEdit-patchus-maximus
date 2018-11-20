import ingredientExclusions from '../config/alchemy/ingredientExclusions.json';
import potionExclusions from '../config/alchemy/potionExclusions.json';
import npcExclusions from '../config/npcExclusions.json';
import staffCraftingExclusions from '../config/staffCraftingExclusions.json';

const magicSkillPath = 'Magic Effect Data\\DATA - Data\\Magic Skill';

export function addSpell(record, spellFormID) {
    xelib.AddArrayItem(record, 'Actor Effects', '', spellFormID);
}

export function getLinkedRecord(element, path, patchFile) {
    const linkedRecord = xelib.GetLinksTo(element, path);
    const linkedRecordOverride = xelib.GetPreviousOverride(linkedRecord, patchFile);
    return xelib.CopyElement(linkedRecordOverride, patchFile, false);
}

export function removeMagicSchool(record, patchFile) {
    const mgefRecords = xelib.GetElements(record, 'Effects')
        .map(effect => getLinkedRecord(effect, 'EFID', patchFile))
        .filter(mgef => xelib.GetValue(mgef, magicSkillPath) !== 'None');

    mgefRecords.forEach(mgef => {
        xelib.SetValue(mgef, magicSkillPath, 'None');
    });
}

const exclusions = [ingredientExclusions, potionExclusions, npcExclusions];

export function isExcludedFromPatching(record) {
    const exclusion = exclusions.find(e => xelib.Signature(record) === e.recordSignature);
    return (exclusion.editorIDs && exclusion.editorIDs.find(e => e.test(xelib.EditorID(record))))
        || (exclusion.names && exclusion.names.find(n => n.test(xelib.FullName(record))));
}

export function isExcludedFromStaffCrafting(book, spell) {
    
}
