import ingredientExclusions from '../config/alchemy/ingredientExclusions.json';
import potionExclusions from '../config/alchemy/potionExclusions.json';
import npcExclusions from '../config/npcExclusions.json';
import alchemyEffects from '../config/alchemy/alchemyEffects.json';
import ingredientVariations from '../config/alchemy/ingredientVariations.json';
import potionMultipliers from '../config/alchemy/potionMultipliers.json';
import armorMaterials from '../config/materials/armorMaterials.json';
import weaponMaterials from '../config/materials/weaponMaterials.json';
import recipeMaterials from '../config/materials/recipeMaterials.json';

export default class ConfigService {
    constructor() {
        this.exclusions = [ingredientExclusions, potionExclusions, npcExclusions];
        this.exclusions.forEach(exclusion => {
            if (exclusion.editorIDs) {
                exclusion.editorIDs = exclusion.editorIDs.map(editorID => new RegExp(editorID));
            }
            if (exclusion.names) {
                exclusion.names = exclusion.names.map(name => new RegExp(name));
            }
        });

        this.alchemyEffects = alchemyEffects;
        this.ingredientVariations = ingredientVariations;
        this.potionMultipliers = potionMultipliers;
        this.armorMaterials = armorMaterials;
        this.weaponMaterials = weaponMaterials;
        this.recipeMaterials = recipeMaterials;
    }

    isExcluded(record) {
        const exclusion = this.exclusions.find(e => xelib.Signature(record) === e.recordSignature);
        return (exclusion.editorIDs && exclusion.editorIDs.find(e => e.test(xelib.EditorID(record))))
            || (exclusion.names && exclusion.names.find(n => n.test(xelib.FullName(record))));
    }

    static getItemBySubstring(list, searchValue) {
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
    }

    getAlchemyEffect(name) {
        return ConfigService.getItemBySubstring(this.alchemyEffects, name);
    }

    getIngredientVariation(name) {
        return ConfigService.getItemBySubstring(this.ingredientVariations, name);
    }

    getPotionMultiplier(name) {
        return ConfigService.getItemBySubstring(this.potionMultipliers, name);
    }

    getArmorMaterial(name) {
        return ConfigService.getItemBySubstring(this.armorMaterials, name);
    }

    getWeaponMaterial(name) {
        return ConfigService.getItemBySubstring(this.weaponMaterials, name);
    }

    getRecipeMaterial(type) {
        return this.recipeMaterials[type];
    }
}
