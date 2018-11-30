import { addSpell } from '../utils';

export default function racePatcher(locals) {
    return {
        load: {
            signature: 'RACE',
            filter: record => {
                const editorID = xelib.EditorID(record);
                // TODO use config file
                return !editorID.includes('Manakin');
            }
        },
        patch: record => {
            if (locals.useWarrior) {
                addSpell(record, locals.SPEL.xMAWARMainLogicAbility);
                addSpell(record, locals.SPEL.xMAWARMainStaminaAbility);

                if (locals.useThief && xelib.GetFlag(record, 'DATA - \\Flags', 'Playable')) {
                    addSpell(record, locals.SPEL.xMATHICombatAbility);
                    addSpell(record, locals.SPEL.xMAWARTHIPassiveArmorHeavy);
                    addSpell(record, locals.SPEL.xMAWARTHIPassiveArmorLight);
                }
            }
        }
    };
}
