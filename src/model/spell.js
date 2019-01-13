import Record from './record';
import { removeNonAlphaCharacters, getLinkedRecord } from '../utils';

export default class Spell extends Record {
  get cleanedName() {
    return removeNonAlphaCharacters(this.name);
  }

  get baseCost() {
    if (!this._baseCost) {
      this._baseCost = xelib.GetValue(this.record, 'SPIT\\Base Cost');
    }
    return this._baseCost;
  }

  get castType() {
    if (!this._castType) {
      this._castType = xelib.GetValue(this.record, 'SPIT\\Cast Type');
    }
    return this._castType;
  }

  get targetType() {
    if (!this._targetType) {
      this._targetType = xelib.GetValue(this.record, 'SPIT\\Target Type');
    }
    return this._targetType;
  }

  get isSelfTargeting() {
    return this.targetType === 'Self';
  }

  isCompatibleWithStaff(patchFile) {
    return !this.isDualCastOnly(patchFile)
      && this.getSpellSchool(patchFile)
      && this.targetType !== 'Self'
      && this.castType !== 'Constant Effect';
  }

  getSpellSchool(patchFile) {
    const supportedSpellSchools = ['Alteration', 'Conjuration', 'Destruction', 'Illusion', 'Restoration'];
    return xelib.GetElements(this.record, 'Effects')
      .map(effect => {
        const effectRecord = getLinkedRecord(effect, 'EFID', patchFile);
        return xelib.GetValue(effectRecord, 'Magic Effect Data\\DATA - Data\\Magic Skill');
      })
      .find(school => supportedSpellSchools.includes(school));
  }

  isDualCastOnly(patchFile) {
    const equipType = getLinkedRecord(this.record, 'ETYP - Equipment Type', patchFile);
    return xelib.EditorID(equipType) === 'BothHands';
  }
}
