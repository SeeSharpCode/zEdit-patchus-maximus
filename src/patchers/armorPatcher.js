import { getLinkedRecord, removeMagicSchool } from '../utils';
import { isExcludedFromPatching } from '../exclusions';
import { getPotionMultiplier, getAlchemyEffect } from '../config';

const clothingAndJewelryFormID = "000C2CD8"; // QAClothingJewelryContainer "All Clothing and Jewelry" [CONT:000C2CD8]

export default function armorPatcher(patchFile, locals) {
  const cAndJ = xelib.GetRecord(clothingAndJewelryFormID);
  const elements = xelib.GetElements(cAndJ);
  xelib.log(elements);

  return {
    load: {
      signature: 'ARMO',
      filter: record => locals.useWarrior
    },
    patch: record => {}
  };
}
