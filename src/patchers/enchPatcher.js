export default function enchPatcher(patchFile, locals) {
    return {
        load: {
            signature: 'ENCH',
            filter: record => {
                if (!locals.useMage) return false;
                const type = xelib.GetValue(record, 'ENIT - Effect Data\\Enchant Type');
                const castType = xelib.GetValue(record, 'ENIT - Effect Data\\Cast Type');
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
