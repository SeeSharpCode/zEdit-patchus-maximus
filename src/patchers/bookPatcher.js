import { isExcludedFromStaffCrafting } from '../exclusions';
import { getLinkedRecord } from '../utils';

export default function bookPatcher(patch, helpers) {
    const log = message => helpers.logMessage(`(BOOK) ${message}`);

    const supportedSpellSchools = ['Alteration', 'Conjuration', 'Destruction', 'Illusion', 'Restoration'];

    const shouldCreateStaff = function(bookEditorID, spellEditorID) {
        return isExcludedFromStaffCrafting(bookEditorID) || isExcludedFromStaffCrafting(spellEditorID);
    };

    const shouldCreateStaffEnchantment = function(spell) {
        const castType = xelib.GetValue(spell, 'SPIT - Data\\Cast Type');
        if (castType === 'Constant Effect') {
            log(`skipping staff creation for Constant Effect spell: ${xelib.FullName(spell)}`);
            return false;
        }

        const targetType = xelib.GetValue(spell, 'SPIT - Data\\Target Type');
        if (targetType === 'Self') {
            log(`skipping staff creation for self-targeting spell: ${xelib.FullName(spell)}`);
            return false;
        }

        const equipType = getLinkedRecord(spell, 'ETYP - Equipment Type', patch);
        if (xelib.EditorID(equipType) === 'BothHands') {
            log(`skipping staff creation for dual cast spell: ${xelib.FullName(spell)}`);
            return false;
        }

        return xelib.GetElements(spell, 'Effects').some(effect => {
            const skillType = xelib.GetValue(effect, 'Magic Effect Data\\DATA - Data\\Magic Skill');
            return supportedSpellSchools.includes(skillType);
        });
    };

    const createStaffEnchantment = function(spell) {
        if (!shouldCreateStaffEnchantment(spell)) return;
    };

    const createStaff = function(spell) {
        const staffEnchantment = createStaffEnchantment(spell);
        
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
