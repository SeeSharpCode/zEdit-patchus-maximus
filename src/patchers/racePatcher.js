import { addSpell } from '../utils';

export default function racePatcher(locals, settings) {
  return {
    load: {
      signature: 'RACE',
      filter: race => !settings.race.excludedEditorIDs.includes(xelib.EditorID(race)),
    },
    patch: race => {
      if (locals.useWarrior) {
        addSpell(race, locals.SPEL.xMAWARMainLogicAbility);
        addSpell(race, locals.SPEL.xMAWARMainStaminaAbility);

        if (locals.useThief && xelib.GetFlag(race, 'DATA\\Flags', 'Playable')) {
          addSpell(race, locals.SPEL.xMATHICombatAbility);
          addSpell(race, locals.SPEL.xMAWARTHIPassiveArmorHeavy);
          addSpell(race, locals.SPEL.xMAWARTHIPassiveArmorLight);
        }
      }
    },
  };
}
