export default function($scope, skyrimMaterialService, skyrimArmorKeywordService) {
  const armorWithoutMaterials = xelib.GetRecords(0, 'ARMO')
    .filter(armor => skyrimArmorKeywordService.getArmorType(armor) !== 'Clothing' && skyrimArmorKeywordService.getArmorType(armor) !== 'Jewelry')
    .filter(armor => !skyrimMaterialService.getMaterial(armor))
    .map(armor => `${xelib.EditorID(armor)} ${skyrimArmorKeywordService.getArmorPart(armor)} ${skyrimArmorKeywordService.getArmorType(armor)}`);

  $scope.armorWithoutMaterials = [...new Set(armorWithoutMaterials)];
}
