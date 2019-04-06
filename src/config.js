import alchemyEffects from '../config/alchemy/alchemyEffects.json';
import ingredientVariations from '../config/alchemy/ingredientVariations.json';
import potionMultipliers from '../config/alchemy/potionMultipliers.json';
import armorMaterials from '../config/materials/armorMaterials.json';
import weaponMaterials from '../config/materials/weaponMaterials.json';

const getItemBySubstring = (config, searchValue) => {
  let result = null;
  let matchLength = 0;

  Object.keys(config).forEach(key => {
    config[key].nameSubstrings.forEach(substring => {
      if (searchValue.includes(substring) && substring.length > matchLength) {
        result = config[key];
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
