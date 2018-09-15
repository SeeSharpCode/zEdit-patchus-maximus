export default function spellPatcher(patchFile, locals) {
    return {
        load: {
            signature: 'SPEL',
            filter: record => {
                if (!locals.useMage) return false;
                const type = xelib.GetValue(record, 'SPIT - Data\\Type');
                const castType = xelib.GetValue(record, 'SPIT - Data\\Cast Type');
                return type === 'Ability' || castType === 'Constant Effect';
            }
        },
        patch: record => {
            const magicSkillPath = 'Magic Effect Data\\DATA - Data\\Magic Skill';
            const effects = xelib.GetElements(record, 'Effects');
            effects.forEach(effect => {
                const mgef = xelib.GetLinksTo(effect, 'EFID');
                const mgefOverride = xelib.GetPreviousOverride(mgef, patchFile);
                // TODO helpers.copyToPatch in UPF 1.5+
                const newMgef = xelib.CopyElement(mgefOverride, patchFile, false);
                xelib.SetValue(newMgef, magicSkillPath, 'None');
            });
        }
    };
}
