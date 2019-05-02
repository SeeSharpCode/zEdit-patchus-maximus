import { getLinkedRecord } from '../utils';
import createStaffService from '../services/staffService';
import createScrollService from '../services/scrollService';

import Spell from '../model/spell';

export default function bookPatcher(patchFile, locals, helpers) {
  const staffService = createStaffService(patchFile, locals, helpers);
  const scrollService = createScrollService(patchFile, locals, helpers);

  const patchBook = book => {
    const spellRecord = getLinkedRecord(book, 'DATA\\Teaches', patchFile);
    const spell = new Spell(spellRecord);

    if (staffService.shouldCreateStaff(book, spell)) {
      staffService.createStaff(book, spell);
    }

    if (scrollService.shouldCreateScroll(book, spell)) {
      scrollService.createScroll(spell);
    }
  };

  return {
    load: {
      signature: 'BOOK',
      filter: book => xelib.GetFlag(book, 'DATA\\Flags', 'Teaches Spell'),
    },
    patch: patchBook,
  };
}
