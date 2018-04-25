// let cobjPatcher = function() {
//     class Recipe {
//         constructor(record) {
//             this.record = record;
//             this.editorID = xelib.EditorID(record);
//             this.workbenchEditorID = xelib.EditorID(xelib.GetLinksTo(record, 'BNAM'));
//             this.outputRecord = xelib.GetLinksTo(record, 'CNAM');
//             if (this.outputRecord) {
//                 this.outputRecordEditorID = xelib.EditorID(this.outputRecord);
//                 this.outputRecordName = xelib.Name(this.outputRecord);
//             }
//         }

//         get isStaffRecipe() {
//             return this.workbenchEditorID === CRAFTING_STATIONS.STAFF_ENCHANTER_EDITOR_ID;
//         }

//         get isWeaponRecipe() {
//             return this.workbenchEditorID === CRAFTING_STATIONS.SHARPENING_WHEEL_EDITOR_ID;
//         }

//         get isArmorRecipe() {
//             return this.workbenchEditorID === CRAFTING_STATIONS.ARMOR_TABLE_EDITOR_ID;
//         }
//     }

//     let shouldDisableStaffRecipe = function(staffCraftingDisableExclusions, outputRecordEditorID) {
//         // TODO: reevaluate this logic, seems funky
//         let shouldDisable = false;
//         staffCraftingDisableExclusions.forEach(exclusion => {
//             if (outputRecordEditorID.includes(exclusion)) {
//                 return true;
//             }
//         });
//         return false;
//     };

//     let changeRecipeConditions = function(recipe, materials, helpers) {
//         helpers.logMessage(`Removing conditions for ${recipe.editorID}`);
//         xelib.RemoveElement(recipe.record, 'Conditions');

//         let smithingPerkFormID = getSmithingPerkFormID(recipe, helpers);
//         if (!smithingPerkFormID) {
//             return;
//         }
//         xelib.AddElement(recipe.record, 'Conditions');
//         let condition = xelib.AddCondition(recipe.record, 'HasPerk', '10000000', '1');
//         xelib.SetValue(condition, 'CTDA\\Parameter #1', smithingPerkFormID);
//         xelib.RemoveCondition(recipe.record, 'GetWantBlocking');
//     }

//     let getSmithingPerkFormID = function(recipe, helpers) {
//         let materialName = getMaterialName(recipe.outputRecordName, materials, helpers);
//         if (!materialName) {
//             helpers.logMessage(`WARNING: No material found for ${recipe.outputRecordName}. ${recipe.EditorID} recipe will not be patched.`);
//             return null;
//         }

//         let material = MATERIALS.find(m => m.name === materialName);
//         if (!material) {
//             helpers.logMessage(`WARNING: No material found with name ${materialName}. ${recipe.EditorID} recipe will not be patched.`);
//             return null;
//         }

//         return material.smithingPerkFormID;
//     }

//     let getMaterialName = function(outputName, materials, helpers) {
//         let matchLength = 0;
//         let materialName = null;

//         materials.forEach(m => {
//             m.nameSubstrings.forEach(substring => {
//                 if (outputName.includes(substring) && substring.length > matchLength) {
//                     materialName = m.material;
//                     matchLength = substring.length;
//                 }
//             });
//         });

//         return materialName;
//     }

//     return {
//         load: function(plugin, helpers, settings, locals) {
//             return {
//                 signature: 'COBJ',
//                 filter: function(record) {
//                     let recipe = new Recipe(record);
//                     if (!recipe.isStaffRecipe && !recipe.isWeaponRecipe && !recipe.isArmorRecipe) {
//                         return false;
//                     }
//                     if (!recipe.output) {
//                         helpers.logMessage(`WARNING: ${recipe.editorID} has no output and will not be patched.`);
//                         return false;
//                     }
//                     return true;
//                 }
//             }
//         },
//         patch: function(record, helpers, settings, locals) {
//             let recipe = new Recipe(record);

//             // TODO: if useMage
//             if (recipe.isStaffRecipe() && shouldDisableStaffRecipe(locals.enchantingConfig.staffCraftingDisableExclusions, recipe.outputRecordEditorID)) {
//                 helpers.logMessage(`Disabling staff recipe: ${recipe.editorID}`);
//                 // TODO: verify this works, probably doesn't
//                 xelib.SetUIntValue(record, 'BNAM', 0x00013794);
//             } else if (recipe.isWeaponRecipe || recipe.isArmorRecipe) {
//                 // TODO: if useWarrior
//                 let materials = recipe.isWeaponRecipe ? locals.weaponMaterials : locals.armorMaterials;
//                 changeRecipeConditions(recipe, materials, helpers);
//             }
//         }
//     };
// }