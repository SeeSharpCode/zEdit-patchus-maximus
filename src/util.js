const magicSkillPath = 'Magic Effect Data\\DATA - Data\\Magic Skill';

export function addSpell(record, spellFormID) {
    xelib.AddArrayItem(record, 'Actor Effects', '', spellFormID);
}

export function getEffects(record, patchFile) {
    return xelib.GetElements(record, 'Effects').map(effect => {
        const mgef = xelib.GetLinksTo(effect, 'EFID');
        return xelib.GetPreviousOverride(mgef, patchFile);
    });
}

export function removeMagicSchool(record, patchFile) {
    const effects = getEffects(record, patchFile).filter(effect => xelib.GetValue(effect, magicSkillPath) !== 'None');
    effects.forEach(effect => {
        // TODO helpers.copyToPatch in UPF 1.5+
        const patchedMgef = xelib.CopyElement(effect, patchFile, false);
        xelib.SetValue(patchedMgef, magicSkillPath, 'None');
    });
}
