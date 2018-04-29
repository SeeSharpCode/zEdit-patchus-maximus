class CraftingConstants {
    static get SMITHING_PERK_FORM_IDS() {
        return {
            STEEL: "cb40d",
            DWARVEN: "cb40e",
            ORCISH: "cb410",
            EBONY: "cb412",
            DAEDRIC: "cb413",
            ELVEN: "cb40f",
            ADVANCED: "cb414",
            GLASS: "cb411",
            DRAGON: "52190",
            LEATHER: getFormID('PerkusMaximus_Master.esp', 'PERK', 'xMASMIMaterialLeather'),
            SILVER: getFormID('PerkusMaximus_Master.esp', 'PERK', 'xMASMIMaterialGoldAndSilver'),
            REFINED_SILVER: getFormID('PerkusMaximus_Master.esp', 'PERK', 'xMASMIMaterialRefinedSilver')
        };
    }

    static get INGOT_FORM_IDS() {
        return {
            STEEL: "5ace5",
            DWARVEN: "db8a2",
            MALACHITE: "5ada1",
            QUICKSILVER: "5ada0",
            MOONSTONE: "5ad9f",
            GOLD: "5ad9e",
            EBONY: "5ad9d",
            ORICHALCUM: "5ad99",
            CORONDUM: "5ad93",
            IRON: "5ace4",
            SILVER: "5ace3",
            CHITIN: "3ad57",
            DRAGONBONE: "3ada4",
            STALHRIM: "2b06b",
            CHARCOAL: "33760",
            FIREWOOD: "6f993",
            LEATHER_STRIPS: "800e4"
        };
    }

    static get CRAFTING_STATIONS() {
        return {
            SMELTER_FORM_ID: "a5cce",
            TANNING_RACK_FORM_ID: "7866a",
            STAFF_ENCHANTER_EDITOR_ID: "DLC2StaffEnchanter",
            SHARPENING_WHEEL_EDITOR_ID: "CraftingSmithingSharpeningWheel",
            ARMOR_TABLE_EDITOR_ID: "CraftingSmithingArmorTable"
        };
    }

    static get MATERIALS() {
        return [
            {
                name: "IRON",
                smithingPerkFormID: null,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.IRON,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.IRON
            },
            {
                name: "STEEL",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.STEEL,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.STEEL,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.STEEL
            },
            {
                name: "DWARVEN",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.DWARVEN,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.DWARVEN,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.DWARVEN
            },
            {
                name: "FALMER",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.ADVANCED,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.CHITIN,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.CHITIN
            },
            {
                name: "ORCISH",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.ORCISH,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.ORICHALCUM,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.ORICHALCUM
            },
            {
                name: "EBONY",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.EBONY,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.EBONY,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.EBONY
            },
            {
                name: "DRAGONPLATE",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.DRAGON,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.DRAGONBONE,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.DRAGONBONE
            },
            {
                name: "DAEDRIC",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.DAEDRIC,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.EBONY,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.DRAGONBONE
            },
            {
                name: "ELVEN",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.ELVEN,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.MOONSTONE,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.MOONSTONE
            },
            {
                name: "GLASS",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.GLASS,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.MALACHITE,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.MALACHITE
            },
            {
                name: "DRAGONSCALE",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.DRAGON,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.DRAGONBONE,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.DRAGONBONE
            },
            {
                name: "STALHRIM",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.EBONY,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.STALHRIM,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.STALHRIM
            },
            {
                name: "WOOD",
                smithingPerkFormID: null,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.CHARCOAL,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.FIREWOOD
            },
            {
                name: "ADVANCED",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.ADVANCED,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.CORONDUM,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.CORONDUM
            },
            {
                name: "SILVER",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.SILVER,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.SILVER,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.SILVER
            },
            {
                name: "REFINED_SILVER",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.REFINED_SILVER,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.SILVER,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.SILVER
            },
            {
                name: "DRAUGR",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.STEEL,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.STEEL,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.STEEL
            },
            {
                name: "CHITIN",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.ADVANCED,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.CORONDUM,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.CORONDUM
            },
            {
                name: "GOLD",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.SILVER,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.GOLD,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.GOLD
            },
            {
                name: "BONEMOLD_HEAVY",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.ADVANCED,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.IRON,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.IRON
            },
            {
                name: "STEELPLATE",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.ADVANCED,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.STEEL,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.STEEL
            },
            {
                name: "FUR",
                smithingPerkFormID: null,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.LEATHER_STRIPS,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.TANNING_RACK_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.LEATHER_STRIPS
            },
            {
                name: "HIDE",
                smithingPerkFormID: null,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.LEATHER_STRIPS,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.TANNING_RACK_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.LEATHER_STRIPS
            },
            {
                name: "LEATHER",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.LEATHER,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.LEATHER_STRIPS,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.TANNING_RACK_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.LEATHER_STRIPS
            },
            {
                name: "SCALED",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.ADVANCED,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.CORONDUM,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.TANNING_RACK_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.CORONDUM
            },
            {
                name: "SCALED",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.ADVANCED,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.CORONDUM,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.TANNING_RACK_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.CORONDUM
            },
            {
                name: "STALHRIM_HEAVY",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.EBONY,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.STALHRIM,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.STALHRIM
            },
            {
                name: "STALHRIM_LIGHT",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.EBONY,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.STALHRIM,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.STALHRIM
            },
            {
                name: "NORDIC_HEAVY",
                smithingPerkFormID: CraftingConstants.SMITHING_PERK_FORM_IDS.ADVANCED,
                meltdownProductFormID: CraftingConstants.INGOT_FORM_IDS.CORONDUM,
                meltdownCraftingStationFormID: CraftingConstants.CRAFTING_STATIONS.SMELTER_FORM_ID,
                temperingInputFormID: CraftingConstants.INGOT_FORM_IDS.CORONDUM
            },
        ];
    }
}