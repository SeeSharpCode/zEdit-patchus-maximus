// TODO extend base record class
export default class Shout {
  constructor(record) {
    this.editorID = xelib.EditorID(record);
    this.record = record;
    this.archetype = xelib.GetValue(this.record, 'Magic Effect Data\\DATA - Data\\Archtype');
  }

  static get HARMFUL_SHOUT_ARCHETYPES() {
    return ['Value Modifier', 'Peak Value Modifier', 'Dual Value Modifier'];
  }

  get isHarmful() {
    return Shout.HARMFUL_SHOUT_ARCHETYPES.includes(this.archetype)
      && xelib.GetFlag(this.record, 'Magic Effect Data\\DATA - Data\\Flags', 'Detrimental'); // TODO ensure this works
  }

  get isSummoning() {
    return this.archetype === 'Summon Creature';
  }

  addKeyword(keywords) {
    let keyword = '';
    if (this.isHarmful) {
      keyword = keywords.xMASPEShoutHarmful;
    } else if (this.isSummoning) {
      keyword = keywords.xMASPEShoutSummoning;
    } else {
      keyword = keywords.xMASPEShoutNonHarmful;
    }
    xelib.AddKeyword(this.record, keyword);
  }
}
