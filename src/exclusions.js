import ingredientExclusions from '../config/exclusions/ingredients.json';
import potionExclusions from '../config/exclusions/potions.json';
import npcExclusions from '../config/exclusions/npcs.json';
import staffCraftingExclusions from '../config/exclusions/staffCrafting.json';

const exclusions = {
  ...ingredientExclusions,
  ...potionExclusions,
  ...npcExclusions,
  ...staffCraftingExclusions
};

// convert editor IDs and names to regex patterns
Object.keys(exclusions).forEach(exclusion => {
  Object.keys(exclusion).forEach(list => {
    exclusion[list] = exclusion[list].map(item => new RegExp(item));
  });
});

export function isExcludedFromPatching(record) {
  const signature = xelib.Signature(record);
  const { editorIDs, names } = exclusions[signature];
  return (editorIDs && editorIDs.some(p => p.test(xelib.EditorID(record))))
    || (names && names.some(p => p.test(xelib.FullName(record))));
}
