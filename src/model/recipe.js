export default class Recipe {
  constructor(record) {
    this.record = record;
    this.editorID = xelib.EditorID(record);
    // TODO get override for LinksTo?
    this.workbench = xelib.EditorID(xelib.GetLinksTo(record, 'BNAM'));
    this.outputRecord = xelib.GetLinksTo(record, 'CNAM');
    if (this.outputRecord) {
      this.outputRecordEditorID = xelib.EditorID(this.outputRecord);
      this.outputRecordName = xelib.FullName(this.outputRecord);
    }
  }

  get isWeaponRecipe() {
    return this.workbench === 'CraftingSmithingSharpeningWheel';
  }

  get isArmorRecipe() {
    return this.workbench === 'CraftingSmithingArmorTable';
  }

  get isStaffRecipe() {
    return this.workbench === 'DLC2StaffEnchanter';
  }
}
