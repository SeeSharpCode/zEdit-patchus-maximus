import ingredientExclusions from '../config/exclusions/ingredients.json';
import potionExclusions from '../config/exclusions/potions.json';
import npcExclusions from '../config/exclusions/npcs.json';
import staffCraftingExclusions from '../config/exclusions/staffCrafting.json';
import scrollCraftingExclusions from '../config/exclusions/scrollCrafting.json';

const exclusions = {
  ...ingredientExclusions,
  ...potionExclusions,
  ...npcExclusions,
  ...staffCraftingExclusions,
  ...scrollCraftingExclusions,
};

// convert editor IDs and names to regex patterns
Object.keys(exclusions).forEach(exclusionKey => {
  const exclusion = exclusions[exclusionKey];
  Object.keys(exclusion).forEach(list => {
    exclusion[list] = exclusion[list].map(item => new RegExp(item));
  });
});

const isExcluded = function(record, exclusion) {
  return Object.keys(exclusion).some(field => {
    const searchValue = xelib.GetValue(record, field);
    return exclusion[field].some(pattern => pattern.test(searchValue));
  });
};

export function isExcludedFromPatching(record) {
  const signature = xelib.Signature(record);
  const exclusion = exclusions[signature];
  return isExcluded(record, exclusion);
}

export function isExcludedFromStaffCrafting(record) {
  return isExcluded(record, exclusions.staffCrafting);
}

export function isExcludedFromScrollCrafting(record) {
  return isExcluded(record, exclusions.scrollCrafting);
}
