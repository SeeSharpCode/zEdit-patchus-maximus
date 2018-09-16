const magicSkillPath = 'Magic Effect Data\\DATA - Data\\Magic Skill';

export function addSpell(record, spellFormID) {
    xelib.AddArrayItem(record, 'Actor Effects', '', spellFormID);
}

export function removeMagicSchool(record, patchFile) {
    const effects = xelib.GetElements(record, 'Effects');
    effects.forEach(effect => {
        const mgef = xelib.GetLinksTo(effect, 'EFID');
        const mgefOverride = xelib.GetPreviousOverride(mgef, patchFile);
        // TODO helpers.copyToPatch in UPF 1.5+
        const newMgef = xelib.CopyElement(mgefOverride, patchFile, false);
        xelib.SetValue(newMgef, magicSkillPath, 'None');
    });
}
