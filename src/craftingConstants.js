const SMITHING_PERK_FORM_IDS = {
    LEATHER: "1d8be6",
    STEEL: "cb40d",
    DWARVEN: "cb40e",
    ORCISH: "cb410",
    EBONY: "cb412",
    DAEDRIC: "cb413",
    ELVEN: "cb40f",
    ADVANCED: "cb414",
    GLASS: "cb411",
    DRAGON: "52190",
    SILVER: "a82a6", // TODO: PerMa form ID
    REFINED_SILVER: "54ff5" // TODO: PerMa form ID
};

const INGOT_FORM_IDS = {
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

const CRAFTING_STATIONS = {
    SMELTER_FORM_ID: "a5cce",
    TANNING_RACK_FORM_ID: "7866a",
    STAFF_ENCHANTER_EDITOR_ID: "DLC2StaffEnchanter",
    SHARPENING_WHEEL_EDITOR_ID: "CraftingSmithingSharpeningWheel",
    ARMOR_TABLE_EDITOR_ID: "CraftingSmithingArmorTable"
};

const MATERIALS = [
    {
        name: "IRON",
        smithingPerkFormID: null,
        meltdownProductFormID: INGOT_FORM_IDS.IRON,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.IRON
    },
    {
        name: "STEEL",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.STEEL,
        meltdownProductFormID: INGOT_FORM_IDS.STEEL,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.STEEL
    },
    {
        name: "DWARVEN",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.DWARVEN,
        meltdownProductFormID: INGOT_FORM_IDS.DWARVEN,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.DWARVEN
    },
    {
        name: "FALMER",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.ADVANCED,
        meltdownProductFormID: INGOT_FORM_IDS.CHITIN,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.CHITIN
    },
    {
        name: "ORCISH",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.ORCISH,
        meltdownProductFormID: INGOT_FORM_IDS.ORICHALCUM,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.ORICHALCUM
    },
    {
        name: "EBONY",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.EBONY,
        meltdownProductFormID: INGOT_FORM_IDS.EBONY,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.EBONY
    },
    {
        name: "DRAGONPLATE",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.DRAGON,
        meltdownProductFormID: INGOT_FORM_IDS.DRAGONBONE,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.DRAGONBONE
    },
    {
        name: "DAEDRIC",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.DAEDRIC,
        meltdownProductFormID: INGOT_FORM_IDS.EBONY,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.DRAGONBONE
    },
    {
        name: "ELVEN",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.ELVEN,
        meltdownProductFormID: INGOT_FORM_IDS.MOONSTONE,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.MOONSTONE
    },
    {
        name: "GLASS",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.GLASS,
        meltdownProductFormID: INGOT_FORM_IDS.MALACHITE,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.MALACHITE
    },
    {
        name: "DRAGONSCALE",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.DRAGON,
        meltdownProductFormID: INGOT_FORM_IDS.DRAGONBONE,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.DRAGONBONE
    },
    {
        name: "STALHRIM",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.EBONY,
        meltdownProductFormID: INGOT_FORM_IDS.STALHRIM,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.STALHRIM
    },
    {
        name: "WOOD",
        smithingPerkFormID: null,
        meltdownProductFormID: INGOT_FORM_IDS.CHARCOAL,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.FIREWOOD
    },
    {
        name: "ADVANCED",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.ADVANCED,
        meltdownProductFormID: INGOT_FORM_IDS.CORONDUM,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.CORONDUM
    },
    {
        name: "SILVER",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.SILVER,
        meltdownProductFormID: INGOT_FORM_IDS.SILVER,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.SILVER
    },
    {
        name: "REFINED_SILVER",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.REFINED_SILVER,
        meltdownProductFormID: INGOT_FORM_IDS.SILVER,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.SILVER
    },
    {
        name: "DRAUGR",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.STEEL,
        meltdownProductFormID: INGOT_FORM_IDS.STEEL,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.STEEL
    },
    {
        name: "CHITIN",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.ADVANCED,
        meltdownProductFormID: INGOT_FORM_IDS.CORONDUM,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.CORONDUM
    },
    {
        name: "GOLD",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.SILVER,
        meltdownProductFormID: INGOT_FORM_IDS.GOLD,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.GOLD
    },
    {
        name: "BONEMOLD_HEAVY",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.ADVANCED,
        meltdownProductFormID: INGOT_FORM_IDS.IRON,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.IRON
    },
    {
        name: "STEELPLATE",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.ADVANCED,
        meltdownProductFormID: INGOT_FORM_IDS.STEEL,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.STEEL
    },
    {
        name: "FUR",
        smithingPerkFormID: null,
        meltdownProductFormID: INGOT_FORM_IDS.LEATHER_STRIPS,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.TANNING_RACK_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.LEATHER_STRIPS
    },
    {
        name: "HIDE",
        smithingPerkFormID: null,
        meltdownProductFormID: INGOT_FORM_IDS.LEATHER_STRIPS,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.TANNING_RACK_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.LEATHER_STRIPS
    },
    {
        name: "LEATHER",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.LEATHER,
        meltdownProductFormID: INGOT_FORM_IDS.LEATHER_STRIPS,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.TANNING_RACK_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.LEATHER_STRIPS
    },
    {
        name: "SCALED",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.ADVANCED,
        meltdownProductFormID: INGOT_FORM_IDS.CORONDUM,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.TANNING_RACK_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.CORONDUM
    },
    {
        name: "SCALED",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.ADVANCED,
        meltdownProductFormID: INGOT_FORM_IDS.CORONDUM,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.TANNING_RACK_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.CORONDUM
    },
    {
        name: "STALHRIM_HEAVY",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.EBONY,
        meltdownProductFormID: INGOT_FORM_IDS.STALHRIM,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.STALHRIM
    },
    {
        name: "STALHRIM_LIGHT",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.EBONY,
        meltdownProductFormID: INGOT_FORM_IDS.STALHRIM,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.STALHRIM
    },
    {
        name: "NORDIC_HEAVY",
        smithingPerkFormID: SMITHING_PERK_FORM_IDS.ADVANCED,
        meltdownProductFormID: INGOT_FORM_IDS.CORONDUM,
        meltdownCraftingStationFormID: CRAFTING_STATIONS.SMELTER_FORM_ID,
        temperingInputFormID: INGOT_FORM_IDS.CORONDUM
    },
];