import alchemyEffects from '../config/alchemy/alchemyEffects.json';
import ingredientVariations from '../config/alchemy/ingredientVariations.json';
import potionMultipliers from '../config/alchemy/potionMultipliers.json';
import armorMaterials from '../config/materials/armorMaterials.json';
import weaponMaterials from '../config/materials/weaponMaterials.json';
import recipeMaterials from '../config/materials/recipeMaterials.json';

const getItemBySubstring = function (list, searchValue) {
  let result = null;
  let matchLength = 0;

  list.forEach(item => {
    item.nameSubstrings.forEach(substring => {
      if (searchValue.includes(substring) && substring.length > matchLength) {
        result = item;
        matchLength = substring.length;
      }
    });
  });

  return result;
};

export function getAlchemyEffect(name) {
  return getItemBySubstring(alchemyEffects, name);
}

export function getIngredientVariation(name) {
  return getItemBySubstring(ingredientVariations, name);
}

export function getPotionMultiplier(name) {
  return getItemBySubstring(potionMultipliers, name);
}

export function getArmorMaterial(name) {
  return getItemBySubstring(armorMaterials, name);
}

export function getWeaponMaterial(name) {
  return getItemBySubstring(weaponMaterials, name);
}

export function getRecipeMaterial(type) {
  return recipeMaterials[type];
}
