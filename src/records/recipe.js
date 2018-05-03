//=require ../craftingConstants.js

class Recipe {
    constructor(record) {
        this.record = record;
        this.editorID = xelib.EditorID(record);
        this.workbenchEditorID = xelib.EditorID(xelib.GetLinksTo(record, 'BNAM'));
        this.outputRecord = xelib.GetLinksTo(record, 'CNAM');
        if (this.outputRecord) {
            this.outputRecordEditorID = xelib.EditorID(this.outputRecord);
            this.outputRecordName = xelib.Name(this.outputRecord);
        }
    }

    get isStaffRecipe(staffEnchanterID) {
        return this.workbenchEditorID === CraftingConstants.CRAFTING_STATIONS.STAFF_ENCHANTER_EDITOR_ID;
    }

    get isWeaponRecipe(sharpeningWheelEditorID) {
        return this.workbenchEditorID === CraftingConstants.CRAFTING_STATIONS.SHARPENING_WHEEL_EDITOR_ID;
    }

    get isArmorRecipe() {
        return this.workbenchEditorID === CraftingConstants.CRAFTING_STATIONS.ARMOR_TABLE_EDITOR_ID;
    }
}