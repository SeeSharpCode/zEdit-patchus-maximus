const SMITHING_PERK_FORMIDS = {
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

const INGOT_FORMIDS = {
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

const CRAFTING_STATION_FORMIDS = {
    SMELTER: "a5cce",
    TANNING_RACK: "7866a"
};

const MATERIALS = [
    {
        name: "IRON",
        smithingPerkFormID: null,
        meltdownProductFormID: INGOT_FORMIDS.IRON,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.IRON
    },
    {
        name: "STEEL",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.STEEL,
        meltdownProductFormID: INGOT_FORMIDS.STEEL,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.STEEL
    },
    {
        name: "DWARVEN",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.DWARVEN,
        meltdownProductFormID: INGOT_FORMIDS.DWARVEN,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.DWARVEN
    },
    {
        name: "FALMER",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.ADVANCED,
        meltdownProductFormID: INGOT_FORMIDS.CHITIN,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.CHITIN
    },
    {
        name: "ORCISH",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.ORCISH,
        meltdownProductFormID: INGOT_FORMIDS.ORICHALCUM,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.ORICHALCUM
    },
    {
        name: "EBONY",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.EBONY,
        meltdownProductFormID: INGOT_FORMIDS.EBONY,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.EBONY
    },
    {
        name: "DRAGONPLATE",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.DRAGON,
        meltdownProductFormID: INGOT_FORMIDS.DRAGONBONE,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.DRAGONBONE
    },
    {
        name: "DAEDRIC",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.DAEDRIC,
        meltdownProductFormID: INGOT_FORMIDS.EBONY,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.DRAGONBONE
    },
    {
        name: "ELVEN",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.ELVEN,
        meltdownProductFormID: INGOT_FORMIDS.MOONSTONE,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.MOONSTONE
    },
    {
        name: "GLASS",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.GLASS,
        meltdownProductFormID: INGOT_FORMIDS.MALACHITE,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.MALACHITE
    },
    {
        name: "DRAGONSCALE",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.DRAGON,
        meltdownProductFormID: INGOT_FORMIDS.DRAGONBONE,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.DRAGONBONE
    },
    {
        name: "STALHRIM",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.EBONY,
        meltdownProductFormID: INGOT_FORMIDS.STALHRIM,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.STALHRIM
    },
    {
        name: "WOOD",
        smithingPerkFormID: null,
        meltdownProductFormID: INGOT_FORMIDS.CHARCOAL,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.FIREWOOD
    },
    {
        name: "ADVANCED",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.ADVANCED,
        meltdownProductFormID: INGOT_FORMIDS.CORONDUM,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.CORONDUM
    },
    {
        name: "SILVER",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.SILVER,
        meltdownProductFormID: INGOT_FORMIDS.SILVER,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.SILVER
    },
    {
        name: "REFINED_SILVER",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.REFINED_SILVER,
        meltdownProductFormID: INGOT_FORMIDS.SILVER,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.SILVER
    },
    {
        name: "DRAUGR",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.STEEL,
        meltdownProductFormID: INGOT_FORMIDS.STEEL,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.STEEL
    },
    {
        name: "CHITIN",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.ADVANCED,
        meltdownProductFormID: INGOT_FORMIDS.CORONDUM,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.CORONDUM
    },
    {
        name: "GOLD",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.SILVER,
        meltdownProductFormID: INGOT_FORMIDS.GOLD,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.GOLD
    },
    {
        name: "BONEMOLD_HEAVY",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.ADVANCED,
        meltdownProductFormID: INGOT_FORMIDS.IRON,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.IRON
    },
    {
        name: "STEELPLATE",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.ADVANCED,
        meltdownProductFormID: INGOT_FORMIDS.STEEL,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.STEEL
    },
    {
        name: "FUR",
        smithingPerkFormID: null,
        meltdownProductFormID: INGOT_FORMIDS.LEATHER_STRIPS,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.TANNING_RACK,
        temperingInputFormID: INGOT_FORMIDS.LEATHER_STRIPS
    },
    {
        name: "HIDE",
        smithingPerkFormID: null,
        meltdownProductFormID: INGOT_FORMIDS.LEATHER_STRIPS,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.TANNING_RACK,
        temperingInputFormID: INGOT_FORMIDS.LEATHER_STRIPS
    },
    {
        name: "LEATHER",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.LEATHER,
        meltdownProductFormID: INGOT_FORMIDS.LEATHER_STRIPS,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.TANNING_RACK,
        temperingInputFormID: INGOT_FORMIDS.LEATHER_STRIPS
    },
    {
        name: "SCALED",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.ADVANCED,
        meltdownProductFormID: INGOT_FORMIDS.CORONDUM,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.TANNING_RACK,
        temperingInputFormID: INGOT_FORMIDS.CORONDUM
    },
    {
        name: "SCALED",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.ADVANCED,
        meltdownProductFormID: INGOT_FORMIDS.CORONDUM,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.TANNING_RACK,
        temperingInputFormID: INGOT_FORMIDS.CORONDUM
    },
    {
        name: "STALHRIM_HEAVY",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.EBONY,
        meltdownProductFormID: INGOT_FORMIDS.STALHRIM,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.STALHRIM
    },
    {
        name: "STALHRIM_LIGHT",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.EBONY,
        meltdownProductFormID: INGOT_FORMIDS.STALHRIM,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.STALHRIM
    },
    {
        name: "NORDIC_HEAVY",
        smithingPerkFormID: SMITHING_PERK_FORMIDS.ADVANCED,
        meltdownProductFormID: INGOT_FORMIDS.CORONDUM,
        meltdownCraftingStationFormID: CRAFTING_STATION_FORMIDS.SMELTER,
        temperingInputFormID: INGOT_FORMIDS.CORONDUM
    },
];