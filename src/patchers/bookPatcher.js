import { isExcludedFromStaffCrafting } from '../exclusions';
import { getLinkedRecord } from '../utils';

export default function bookPatcher(patch) {
    const shouldCreateStaff = function(bookEditorID, spellEditorID) {
        return isExcludedFromStaffCrafting(bookEditorID) || isExcludedFromStaffCrafting(spellEditorID);
    };

    const createStaff = function(spell) {
        
    }

    return {
        load: {
            signature: 'BOOK',
            filter: record => xelib.GetFlag(record, 'DATA - Data\\Flags', 'Teaches Spell')
        },
        patch: record => {
            const editorID = xelib.EditorID(record);
            const spell = getLinkedRecord(record, 'DATA - Data\\Teaches', patch);
            const spellEditorID = xelib.EditorID(spell);
            if (shouldCreateStaff(editorID, spellEditorID)) {
                 
            }
        }
    };
}
