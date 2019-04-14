import materials from '../../config/materials.json';

export default function($scope, skyrimMaterialService) {
  const FACTION_ARMOR_KEYWORDS = ['ArmorMaterialThievesGuild', 'ArmorDarkBrotherhood', 'ArmorNightingale'];

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
      && !isDummyArmor(armor) && !isFactionArmor(armor))
    .map(armor => `${xelib.FullName(armor)} (${xelib.EditorID(armor)})`);

  $scope.materials = Object.keys(materials);
  $scope.armorWithoutMaterials = [...new Set(armorWithoutMaterials)];
}
