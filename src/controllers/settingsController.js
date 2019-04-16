import materials from '../../config/materials.json';

export default function($scope, skyrimMaterialService) {
  const FACTION_ARMOR_KEYWORDS = ['ArmorMaterialThievesGuild', 'ArmorDarkBrotherhood', 'ArmorNightingale'];

  const { materialOverrides } = $scope.settings.patchusMaximus.armor;

  const isArmor = armorType => armorType !== 'Clothing' && armorType !== 'Jewelry';
  const isDummyArmor = armor => xelib.HasKeyword(armor, 'Dummy');

  const isFactionArmor = armor => FACTION_ARMOR_KEYWORDS.some(keyword => xelib.HasKeyword(armor, keyword))
    || xelib.FullName(armor).includes('Guard');

  const isPlayable = armor => !(xelib.HasElement(armor, 'BODT\\General Flags') && xelib.GetFlag(armor, 'BODT\\General Flags', '(ARMO)Non-Playable'))
    && !xelib.GetRecordFlag(armor, 'Non-Playable');

  // TODO ArmorDarkBrotherhood, etc. keywords
  const armorWithoutMaterials = xelib.GetRecords(0, 'ARMO')
    .map(armor => xelib.GetWinningOverride(armor))
    .filter(armor => isArmor(xelib.GetArmorType(armor)) && isPlayable(armor) && !skyrimMaterialService.getMaterial(armor)
      && !isDummyArmor(armor) && !isFactionArmor(armor) && (!materialOverrides[xelib.FullName(armor)] || !materialOverrides[xelib.FullName(armor)].material))
    .map(armor => ({ name: xelib.FullName(armor), material: null }));

  $scope.materials = Object.keys(materials);
  $scope.settings.patchusMaximus.armor.materialOverrides = [...materialOverrides, ...armorWithoutMaterials];
}
