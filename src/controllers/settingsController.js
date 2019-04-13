export default function($scope, skyrimMaterialService) {
  const isArmor = armorType => armorType !== 'Clothing' && armorType !== 'Jewelry';
  const isDummy = armor => xelib.HasKeyword(armor, 'Dummy');

  const isPlayable = armor => !(xelib.HasElement(armor, 'BODT\\General Flags') && xelib.GetFlag(armor, 'BODT\\General Flags', '(ARMO)Non-Playable'))
    && !xelib.GetRecordFlag(armor, 'Non-Playable');

  // TODO ArmorDarkBrotherhood, etc. keywords
  const armorWithoutMaterials = xelib.GetRecords(0, 'ARMO')
    .map(armor => xelib.GetWinningOverride(armor))
    .filter(armor => isArmor(armor) && isPlayable(armor) && !skyrimMaterialService.getMaterial(armor) && !isDummy(armor))
    .map(armor => `${xelib.FullName(armor)} (${xelib.EditorID(armor)})`);

  $scope.armorWithoutMaterials = [...new Set(armorWithoutMaterials)];
}
