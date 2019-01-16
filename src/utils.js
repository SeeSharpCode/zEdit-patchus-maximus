export function removeNonAlphaCharacters(string) {
  return string.replace(/[^a-z]/gi, '');
}

export function getRecord(fileName, formID) {
  return xelib.GetElement(0, `${fileName}\\${formID}`);
}

export function getLinkedRecord(element, path, patchFile) {
  const linkedRecord = xelib.GetLinksTo(element, path);
  const linkedRecordOverride = xelib.GetPreviousOverride(linkedRecord, patchFile);
  return xelib.CopyElement(linkedRecordOverride, patchFile, false);
}

export function copyRecord(record, newEditorID, patchFile, helpers) {
  const newRecord = xelib.CopyElement(record, patchFile, true);
  return helpers.cacheRecord(newRecord, newEditorID);
}

export function createRecipe(editorID, benchKeyword, resultFormID, patchFile, helpers) {
  const recipe = xelib.AddElement(patchFile, 'Constructible Object\\COBJ');
  // helpers.cacheRecord will only set the EDID field if it exists
  xelib.AddElement(recipe, 'EDID');
  const cachedRecipe = helpers.cacheRecord(recipe, editorID);

  xelib.AddElementValue(cachedRecipe, 'BNAM', benchKeyword);
  xelib.AddElementValue(cachedRecipe, 'CNAM', resultFormID);
  xelib.AddElementValue(cachedRecipe, 'NAM1', '1');

  return cachedRecipe;
}

export function addSpell(record, spellFormID) {
  xelib.AddArrayItem(record, 'Actor Effects', '', spellFormID);
}

export function removeMagicSchool(record, patchFile) {
  const magicSkillPath = 'Magic Effect Data\\DATA - Data\\Magic Skill';

  const mgefRecords = xelib.GetElements(record, 'Effects')
    .map(effect => getLinkedRecord(effect, 'EFID', patchFile))
    .filter(mgef => xelib.GetValue(mgef, magicSkillPath) !== 'None');

  mgefRecords.forEach(mgef => {
    xelib.SetValue(mgef, magicSkillPath, 'None');
  });
}

export function copyEffects(originRecord, destinationRecord) {
  xelib.RemoveElement(destinationRecord, 'Effects');
  const destinationEffects = xelib.AddElement(destinationRecord, 'Effects');
  xelib.GetElements(originRecord, 'Effects').forEach(effect => xelib.CopyElement(effect, destinationEffects));
}
