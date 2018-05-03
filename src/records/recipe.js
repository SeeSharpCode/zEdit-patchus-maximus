class Recipe {
    constructor(record) {
        this.record = record;
        this.editorID = xelib.EditorID(record);
        this.workbenchFormID = xelib.GetValue(record, 'BNAM'); // TODO: does this work?
        this.outputRecord = xelib.GetLinksTo(record, 'CNAM');
        if (this.outputRecord) {
            this.outputRecordEditorID = xelib.EditorID(this.outputRecord);
            this.outputRecordName = xelib.Name(this.outputRecord);
        }
    }
}