class Recipe {
    constructor(record, craftingStationFormIDs) {
        this.record = record;
        this.editorID = xelib.EditorID(record);
        this.workbenchFormID = xelib.GetHexFormID(xelib.GetLinksTo(record, 'BNAM'));
        this.craftingStationFormIDs = craftingStationFormIDs;
        this.outputRecord = xelib.GetLinksTo(record, 'CNAM');
        if (this.outputRecord) {
            this.outputRecordEditorID = xelib.EditorID(this.outputRecord);
            this.outputRecordName = xelib.Name(this.outputRecord);
        }
    }

    get isWeaponRecipe() {
        return this.workbenchFormID === this.craftingStationFormIDs.SHARPENING_WHEEL;
    }
    
    get isArmornRecipe() {
        return this.workbenchFormID === this.craftingStationFormIDs.ARMOR_TABLE;
    }
    
    get isStaffRecipe() {
        return this.workbenchFormID === this.craftingStationFormIDs.STAFF_ENCHANTER;
    }
}