import { getLinkedRecord } from '../utils';
import { isExcludedFromBookDistribution, isExcludedFromSpellDistribution, isExcludedSpellLeveledList } from '../exclusions';

export default (patchFile, locals, helpers) => {
  const shouldDistribute = (book, spell) => !isExcludedFromBookDistribution(book) && !isExcludedFromSpellDistribution(spell);

  const distribute = (book, spell) => {
    locals.LVLI.forEach(leveledList => {
      if (isExcludedSpellLeveledList(leveledList)) {
        return;
      }

      if (xelib.HasLeveledEntry(leveledList, xelib.EditorID(book))) {
        return;
      }

      const leveledListSpells = xelib.GetElements(leveledList, 'Leveled List Entries')
        .map(leveledEntry => getLinkedRecord(leveledEntry, 'LVLO - Base Data\\Reference', patchFile))
        .filter(entryRecord => xelib.Signature(entryRecord) === 'BOOK' && xelib.GetFlag(entryRecord, 'DATA - Data\\Flags', 'Teaches Spell'))
        .map(bookEntryRecord => getLinkedRecord(bookEntryRecord, 'DATA - Data\\Teaches', patchFile));
    });
  };
};
