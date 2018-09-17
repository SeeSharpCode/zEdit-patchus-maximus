const magicSkillPath = 'Magic Effect Data\\DATA - Data\\Magic Skill';

export function addSpell(record, spellFormID) {
    xelib.AddArrayItem(record, 'Actor Effects', '', spellFormID);
}

export function getLinkedMagicEffect(record, patchFile) {
    const mgef = xelib.GetLinksTo(record, 'EFID');
    return xelib.GetPreviousOverride(mgef, patchFile);
}

export function removeMagicSchool(record, patchFile) {
    const mgefRecords = xelib.GetElements(record, 'Effects')
        .map(effect => getLinkedMagicEffect(effect, patchFile))
        .filter(effect => xelib.GetValue(effect, magicSkillPath) !== 'None');

    mgefRecords.forEach(effect => {
        const patchedMgef = xelib.CopyElement(effect, patchFile, false);
        xelib.SetValue(patchedMgef, magicSkillPath, 'None');
    });
}
