import { getLinkedRecord, removeMagicSchool } from '../utils';
import { isExcludedFromPatching } from '../exclusions';
import { getPotionMultiplier, getAlchemyEffect } from '../config';

const kwClothingBody = "000C2CD8"; // QAClothingJewelryContainer "All Clothing and Jewelry" [CONT:000C2CD8]
const kwClothingRich = "";
const expensiveThreshold = 50;
const heavyArmorKeyword = "heavy"; // Statics.kwArmorHeavy
const lightArmorKeyword = "light"; // Statics.kwArmorLight


const kwArmorSlotGauntlets = ""; //  public static FormID kwArmorSlotGauntlets = new FormID("06c0ef", S_SKYRIM);
const kwArmorSlotHelmet = ""; //  public static FormID kwArmorSlotHelmet = new FormID("06c0ee", S_SKYRIM);
const kwArmorSlotBoots = ""; //  public static FormID kwArmorSlotBoots = new FormID("06c0ed", S_SKYRIM);
const kwArmorSlotCuirass = ""; //  public static FormID kwArmorSlotCuirass = new FormID("06c0ec", S_SKYRIM);
const kwArmorSlotShield = ""; //  public static FormID kwArmorSlotShield = new FormID("0965b2", S_SKYRIM);

const kwArmorLight = ""; //  public static FormID kwArmorLight = new FormID("06bbd3", S_SKYRIM);
const kwArmorHeavy = ""; //  public static FormID kwArmorHeavy = new FormID("06bbd2", S_SKYRIM);

  // clothing

const kwVendorItemClothing = ""; //  public static FormID kwVendorItemClothing = new FormID("08f95b", S_SKYRIM);
const kwArmorClothing = ""; //  public static FormID kwArmorClothing = new FormID("06bbe8", S_SKYRIM);
const kwClothingHands = ""; //  public static FormID kwClothingHands = new FormID("10cd13", S_SKYRIM);
const kwClothingHead = ""; //  public static FormID kwClothingHead = new FormID("10cd11", S_SKYRIM);
const kwClothingFeet = ""; //  public static FormID kwClothingFeet = new FormID("10cd12", S_SKYRIM);
const kwClothingBody = ""; //  public static FormID kwClothingBody = new FormID("0a8657", S_SKYRIM);
const kwClothingCirclet = ""; //  public static FormID kwClothingCirclet = new FormID("10CD08", S_SKYRIM);
const kwClothingPoor = ""; //  public static FormID kwClothingPoor = new FormID("0a865c", S_SKYRIM);
const kwClothingRich = ""; //  public static FormID kwClothingRich = new FormID("10f95b", S_SKYRIM);


const kwArmorHeavyLegs = "" //       a.getKeywordSet().addKeywordRef(Statics.kwArmorHeavyLegs);
const kwArmorLightLegs = "" //       a.getKeywordSet().addKeywordRef(Statics.kwArmorLightLegs);
const kwArmorHeavyChest = "" //       a.getKeywordSet().addKeywordRef(Statics.kwArmorHeavyChest);
const kwArmorLightChest = "" //       a.getKeywordSet().addKeywordRef(Statics.kwArmorLightChest);
const kwArmorHeavyArms = "" //       a.getKeywordSet().addKeywordRef(Statics.kwArmorHeavyArms);
const kwArmorLightArms = "" //       a.getKeywordSet().addKeywordRef(Statics.kwArmorLightArms);
const kwArmorHeavyHead = "" //       a.getKeywordSet().addKeywordRef(Statics.kwArmorHeavyHead);
const kwArmorLightHead = "" //       a.getKeywordSet().addKeywordRef(Statics.kwArmorLightHead);
const kwArmorHeavyShield = "" //       a.getKeywordSet().addKeywordRef(Statics.kwArmorHeavyShield);
const kwArmorLightShield = "" //       a.getKeywordSet().addKeywordRef(Statics.kwArmorLightShield);



function makeClothingExpensive (armor) {
  if (
    xelib.GetGoldValue(armor) >= expensiveThreshold
    && xelib.HasKeyword(kwClothingBody)
    && !xelib.HasKeyword(kwClothingRich)
  ) {
    xelib.AddKeyword(kwClothingRich);

    return true;
  }

  return false;
}

// if (a.getValue() >= Statics.ExpensiveClothingThreshold
//     && xelib.HasKeyword(kwClothingBody)
//     && !xelib.HasKeyword(kwClothingRich)
// ) {
//  xelib.AddKeyword(kwClothingRich);
//  return true;
// }
//
// return false;

  /**
   * Uses some generic conditions to filter out unwanted armor.
   * 
   * @param a
   * @return
   */

// shouldPatch

function shouldPath (armor) {
  // if (template (TNAM Record) is not null) {
  //   return false;
  // } else if (isJewelry) { << Implement
  //   return false
  // } else if (armorWithNoMaterialOrType.contains(armor)) { << implement
  //   return false;
  // }

  // return true;
}

// private boolean shouldPatch(ARMO a) {
// if (!(a.getTemplate().isNull())) {
//   SPGlobal.log("ARMOR_PATCHER", a.getName() + ": Has template");
// return false;
//   } else if (this.s.isJewelry(a)) {
// SPGlobal.log("ARMOR_PATCHER", a.getName() + ": Is jewelry");
//   return false;
// } else if (ArmorPatcher.armorWithNoMaterialOrType.contains(a)) {
//   SPGlobal.log("ARMOR_PATCHER", a.getName() +
//   "previously excluded");
// return false;
// }

//   return true;
// }

  /**
   * Tries to add the armor to a masquerade faction
   * 
   * @param a
   * @return
   */

function addMasqueradeKeyword (armor) {
  const kws = [] // getArmorMasqueradeKeywords(s) // s is mod << implement
  
  if (kws.length === 0)
    return false;

  for (let kw in kws) {
    xelib.AddKeyword(armor, kw);
  }

  return true;
}

// private boolean addMasqueradeKeyword(ARMO a) {
//   ArrayList<FormID> newKWs = this.s.getArmorMasqueradeKeywords(a);

//   if (newKWs.size() == 0) {
//     return false;
//   }

//   for (FormID kw : newKWs) {
//     a.getKeywordSet().addKeywordRef(kw);
//   }

//   // SPGlobal.log("ARMOR_PATCHER", a.getName()
//   // + ": Found masquerade faction(s)");
//   return true;
// }

  /**
   * Adds some more specific keywords to armor pieces to be picked up by perks
   * and script logic.
   * 
   * @param a
   * @return useless right now, always true
   */
      // TODO make return value not suck
function addSpecificKeyword (armor, armorMaterial) {
  if (xelib.HasKeyword(armor, heavyArmorKeyword)) {
    xelib.RemoveKeyword(armor, heavyArmorKeyword);
  }

  if (xelib.HasKeyword(armor, lightArmorKeyword)) {
    xelib.RemoveKeyword(armor, lightArmorKeyword); 
  }

  switch (armorMaterial.type) {
    case "LIGHT":
      xelib.AddKeyword(armor, lightArmorKeyword);

      break;
    case "HEAVY":
      xelib.AddKeyword(armor, heavyArmorKeyword);

      break;
    case "BOTH":
      xelib.AddKeyword(armor, heavyArmorKeyword);
      xelib.AddKeyword(armor, lightArmorKeyword);

      break;
    case "UNDEFINED":
    default:
      return true;
  }

  if (xelib.HasKeyword(armor, kwArmorSlotBoots)) {
    if (xelib.HasKeyword(armor, kwArmorHeavy)) {
      xelib.AddKeyword(armor, kwArmorHeavyLegs);
    }

    if (xelib.HasKeyword(armor, kwArmorLight)) {
      xelib.AddKeyword(armor, kwArmorLightLegs);
    }
  } else if (xelib.HasKeyword(armor, kwArmorSlotCuirass)) {
    if (xelib.HasKeyword(armor, kwArmorHeavy)) {
      xelib.AddKeyword(armor, kwArmorHeavyChest);
    }

    if (xelib.HasKeyword(armor, kwArmorLight)) {
      xelib.AddKeyword(armor, kwArmorLightChest);
    }

  } else if (xelib.HasKeyword(armor, kwArmorSlotGauntlets)) {
    if (xelib.HasKeyword(armor, kwArmorHeavy)) {
      xelib.AddKeyword(armor, kwArmorHeavyArms);
    }
    if (xelib.HasKeyword(armor, kwArmorLight)) {
      xelib.AddKeyword(armor, kwArmorLightArms);
    }
  } else if (xelib.HasKeyword(armor, kwArmorSlotHelmet)) {
    if (xelib.HasKeyword(armor, kwArmorHeavy)) {
      xelib.AddKeyword(armor, kwArmorHeavyHead);
    }
    if (xelib.HasKeyword(armor, kwArmorLight)) {
      xelib.AddKeyword(armor, kwArmorLightHead);
    }
  } else if (xelib.HasKeyword(armor, kwArmorSlotShield)) {

    if (xelib.HasKeyword(armor, kwArmorHeavy)) {
      xelib.AddKeyword(armor, kwArmorHeavyShield);
    }
    if (xelib.HasKeyword(armor, kwArmorLight)) {
      xelib.AddKeyword(armor, kwArmorLightShield);
    }
  }
  return true;
}
}

// private boolean addSpecificKeyword(ARMO a, ArmorMaterial am) {
//   ArrayList<FormID> keywords = a.getKeywordSet().getKeywordRefs();

//   // override basic keywords

//   if (keywords.contains(Statics.kwArmorHeavy)) {
//     keywords.remove(Statics.kwArmorHeavy);
//   }
//   if (keywords.contains(Statics.kwArmorLight)) {
//     keywords.remove(Statics.kwArmorLight);
//   }

//   switch (am.getType()) {
//   case LIGHT:
//     keywords.add(Statics.kwArmorLight);
//     a.getBodyTemplate().setArmorType(BodyTemplateType.Normal,
//         ArmorType.LIGHT);
//     break;
//   case HEAVY:
//     keywords.add(Statics.kwArmorHeavy);
//     a.getBodyTemplate().setArmorType(BodyTemplateType.Normal,
//         ArmorType.HEAVY);
//     break;
//   case BOTH:
//     keywords.add(Statics.kwArmorHeavy);
//     keywords.add(Statics.kwArmorLight);
//     break;
//   case UNDEFINED:
//     return true;
//   default:
//     return true;
//   }

// add specific stuff

//   if (keywords.contains(Statics.kwArmorSlotBoots)) {
//     if (keywords.contains(Statics.kwArmorHeavy)) {
//       a.getKeywordSet().addKeywordRef(Statics.kwArmorHeavyLegs);
//     }

//     if (keywords.contains(Statics.kwArmorLight)) {
//       a.getKeywordSet().addKeywordRef(Statics.kwArmorLightLegs);
//     }
//   } else if (keywords.contains(Statics.kwArmorSlotCuirass)) {
//     if (keywords.contains(Statics.kwArmorHeavy)) {
//       a.getKeywordSet().addKeywordRef(Statics.kwArmorHeavyChest);
//     }

//     if (keywords.contains(Statics.kwArmorLight)) {
//       a.getKeywordSet().addKeywordRef(Statics.kwArmorLightChest);
//     }

//   } else if (keywords.contains(Statics.kwArmorSlotGauntlets)) {
//     if (keywords.contains(Statics.kwArmorHeavy)) {
//       a.getKeywordSet().addKeywordRef(Statics.kwArmorHeavyArms);
//     }
//     if (keywords.contains(Statics.kwArmorLight)) {
//       a.getKeywordSet().addKeywordRef(Statics.kwArmorLightArms);
//     }
//   } else if (keywords.contains(Statics.kwArmorSlotHelmet)) {
//     if (keywords.contains(Statics.kwArmorHeavy)) {
//       a.getKeywordSet().addKeywordRef(Statics.kwArmorHeavyHead);
//     }
//     if (keywords.contains(Statics.kwArmorLight)) {
//       a.getKeywordSet().addKeywordRef(Statics.kwArmorLightHead);
//     }
//   } else if (keywords.contains(Statics.kwArmorSlotShield)) {

//     if (keywords.contains(Statics.kwArmorHeavy)) {
//       a.getKeywordSet().addKeywordRef(Statics.kwArmorHeavyShield);
//     }
//     if (keywords.contains(Statics.kwArmorLight)) {
//       a.getKeywordSet().addKeywordRef(Statics.kwArmorLightShield);
//     }
//   }
//   return true;
// }

  /**
   * Calculates a new armor values from the provided XML stats and sets it if
   * appropriate.
   * 
   * @param a
   * @param am
   * @return true if value was changed
   */

// setArmorValue

  /**
   * Generates a meltdown recipe for a given piece of armor and its
   * XML-defined armor material.
   * 
   * @param a
   * @param am
   */

// addMeltdownRecipe

  /**
   * Creates a meltdown recipe for a piece of clothing.
   * 
   * @param a
   */

// addClothingMeltdownRecipe

  /**
   * Adds tempering recipe for given ARMOR
   * 
   * @param a
   * @param am
   */

// addTemperingRecipe

// createReforgedArmor

// createWarforgedArmor

  /**
   * Creates the copycat armor
   * 
   * @param a
   * @return
   */

// createCopycatArmor

  /**
   * Creates the reforged armor's crafting recipe
   * 
   * @param w
   * @param wm
   * @return
   */

// createReforgedCraftingRecipe

  /**
   * Creates the reforged armor's crafting recipe
   * 
   * @param w
   * @param wm
   * @return
   */

// createWarforgedCraftingRecipe

  /**
   * Creates the copycat armor's crafting recipe
   * 
   * @param w
   * @param wm
   * @return
   */

// createCopycatCraftingRecipe

  /**
   * Create all records related to the Copycat perk
   * 
   * @param w
   * @param wm
   * @return
   */

// doCopycat

  /**
   * Do all changes needed to create a quality leather variant of a given
   * armor, if it makes sense to do so
   * 
   * @return
   */

// doQualityLeather

  /**
   * Get all crafting recipes for a given piece of armor
   * 
   * @param a
   * @return
   */

// getCraftingRecipes

  /**
   * Get all tempering recpes for a given pieve of armor
   * 
   * @param a
   * @return
   */

// getTemperingRecipes

  /**
   * Creates quality leather ARMO record
   * 
   * @param a
   * @return
   */

// createQualityLeatherVariant

// applyArmorModifiers

  /**
   * Find out whether two pieces of armor are similar. Similar: Same slot,
   * same type, same tempering and meltdown material.
   * 
   * Does not cover enchantments
   * 
   * @param a1
   * @param a2
   * @return
   */

// areArmorPiecesSimilar

// doArmorPiecesHaveSameSlot

// doArmorPiecesHaveSameType

/**
 * Decide whether two pieces of clothing are similar.
 * 
 * Similar == same slot and same price keyword (or both no price keyword)
 * 
 * @param a1
 * @param a2
 * @return
 */

// areClothingPiecesSimilar

// doClothingPiecesHaveSameSlot

// doClothingPiecesHaveSimilarPriceCategory

// areEnchantedClothingPiecesSimilar

// areEnchantedJewelryPiecesSimilar

  /**
   * Check if two jewelry pieces are similar.
   * 
   * Similar := same slot and same price category
   * 
   * @param a1
   * @param a2
   * @return
   */

// areJewelryPiecesSimilar

// doJewelryPiecesHaveSameSlot

// doJewelryPiecesHaveSimilarPriceCategory

  // TODO fix if ENCH lookup fails

// createEnchantedArmorVariantsByDirectEnchantmentBinding

  /**
   * Get all armors similar to a. Similar armor tuples should not be
   * enchanted.
   * 
   * @param a
   * @return
   */

// getSimilarArmor

  /**
   * Checks whether an armor already exists with a given enchantment.
   * 
   * @param a
   *            enchanted armor
   * @param id
   *            enchantment form id
   * @return
   */

// doesArmorExistWithEnchantment

  /**
   * Distribute enchanted armors on leveled lists
   * 
   * @param enchantedArmor
   */

// distributeEnchantedArmorOnLeveledListsByDirectEnchantmentBinding

  /**
   * Determines whether two enchanted armor piecess are similar. Definition of
   * similar: Same tempering material, same meltdown material, same slot and
   * type. Enchantments should be linked via at least one binding in xml.
   * 
   * @param w1
   * @param w2
   * @return
   */

// areEnchantedArmorPiecesSimilar

// processDirectEnchantmentBindings

// distributeEnchantedArmorFromBuckets

  /**
   * Take buckets full of ENCH EDIDs, and create enchanted Armor
   * 
   * @param directBindings
   * @return
   */
  // TODO finish?

// generateEnchantedArmorFromBindingList

  /**
   * Create an distribute enchanted armor based on list bindings
   */

// processListEnchantmentBindings



export default function armorPatcher(patchFile, locals, helpers) {
  const garb = xelib.GetRecord(clothingAndJewelryFormID);
  const elements = xelib.GetElements(garb);

  const log = message => helpers.logMessage(`(Armor) ${message}`);

  log(`${armor.name}, ${JSON.stringify(armor)}`);

  return {
    load: {
      signature: 'ARMO',
      filter: record => locals.useWarrior
    },
    patch: record => {}
  };
}
