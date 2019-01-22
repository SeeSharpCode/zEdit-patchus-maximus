import ingredients from '../config/exclusions/ingredients.json';
import potions from '../config/exclusions/potions.json';
import npcs from '../config/exclusions/npcs.json';
import staffCrafting from '../config/exclusions/staffCrafting.json';
import scrollCrafting from '../config/exclusions/scrollCrafting.json';
import spellDistribution from '../config/exclusions/spellDistribution.json';
import bookDistribution from '../config/exclusions/bookDistribution.json';
import spellLeveledLists from '../config/exclusions/spellLeveledLists.json';

const exclusions = {
  ...ingredients,
  ...potions,
  ...npcs,
  ...staffCrafting,
  ...scrollCrafting,
  ...spellDistribution,
  ...bookDistribution,
  ...spellLeveledLists,
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

export function isExcludedFromSpellDistribution(record) {
  return isExcluded(record, exclusions.spellDistribution);
}

export function isExcludedFromBookDistribution(record) {
  return isExcluded(record, exclusions.bookDistribution);
}

export function isExcludedFromSpellLeveledLists(record) {
  return isExcluded(record, exclusions.spellLeveledLists);
}
