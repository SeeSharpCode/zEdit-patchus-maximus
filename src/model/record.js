export default class Record {
  constructor(record) {
    this.record = record;
  }

  get name() {
    if (!this._name) {
      this._name = xelib.FullName(this.record);
    }
    return this._name;
  }

  get editorID() {
    if (!this._editorID) {
      this._editorID = xelib.EditorID(this.record);
    }
    return this._editorID;
  }

  get hexFormID() {
    if (!this._hexFormID) {
      this._hexFormID = xelib.GetHexFormID(this.record);
    }
    return this._hexFormID;
  }
}
