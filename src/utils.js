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
