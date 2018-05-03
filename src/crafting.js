const createCraftingFormIDs = function(dragonbornLoadOrder, perMaMasterLoadOrder) {
    return {
        INGOTS: {
            STEEL: '0005ace5',
            DWARVEN: '000db8a2',
            MALACHITE: '0005ada1',
            QUICKSILVER: '0005ada0',
            MOONSTONE: '0005ad9f',
            GOLD: '0005ad9e',
            EBONY: '0005ad9d',
            ORICHALCUM: '0005ad99',
            CORONDUM: '0005ad93',
            IRON: '0005ace4',
            SILVER: '0005ace3',
            CHITIN: '0003ad57',
            DRAGONBONE: '0003ada4',
            STALHRIM: '0002b06b',
            CHARCOAL: '00033760',
            FIREWOOD: '0006f993',
            LEATHER_STRIPS: '000800e4'
        },
        CRAFTING_STATIONS: {
            SMELTER: '000a5cce',
            TANNING_RACK: '0007866a',
            STAFF_ENCHANTER: dragonbornLoadOrder + '017738',
            SHARPENING_WHEEL: '00088108',
            ARMOR_TABLE: '000adb78'
        },
        SMITHING_PERKS: {
            STEEL: '000cb40d',
            DWARVEN: '000cb40e',
            ORCISH: '000cb410',
            EBONY: '000cb412',
            DAEDRIC: '000cb413',
            ELVEN: '000cb40f',
            ADVANCED: '000cb414',
            GLASS: '000cb411',
            DRAGON: '00052190',
            LEATHER: perMaMasterLoadOrder + '1d8be6',
            SILVER: perMaMasterLoadOrder + '0a82a6',
            REFINED_SILVER: perMaMasterLoadOrder + '054ff5'
        }
    };
};

const createMaterials = function(craftingFormIDs) {
    return [
        {
            name: 'IRON',
            smithingPerkFormID: null,
            meltdownProductFormID: craftingFormIDs.INGOTS.IRON,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.IRON
        },
        {
            name: 'STEEL',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.STEEL,
            meltdownProductFormID: craftingFormIDs.INGOTS.STEEL,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.STEEL
        },
        {
            name: 'DWARVEN',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.DWARVEN,
            meltdownProductFormID: craftingFormIDs.INGOTS.DWARVEN,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.DWARVEN
        },
        {
            name: 'FALMER',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.ADVANCED,
            meltdownProductFormID: craftingFormIDs.INGOTS.CHITIN,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.CHITIN
        },
        {
            name: 'ORCISH',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.ORCISH,
            meltdownProductFormID: craftingFormIDs.INGOTS.ORICHALCUM,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.ORICHALCUM
        },
        {
            name: 'EBONY',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.EBONY,
            meltdownProductFormID: craftingFormIDs.INGOTS.EBONY,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.EBONY
        },
        {
            name: 'DRAGONPLATE',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.DRAGON,
            meltdownProductFormID: craftingFormIDs.INGOTS.DRAGONBONE,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.DRAGONBONE
        },
        {
            name: 'DAEDRIC',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.DAEDRIC,
            meltdownProductFormID: craftingFormIDs.INGOTS.EBONY,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.DRAGONBONE
        },
        {
            name: 'ELVEN',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.ELVEN,
            meltdownProductFormID: craftingFormIDs.INGOTS.MOONSTONE,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.MOONSTONE
        },
        {
            name: 'GLASS',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.GLASS,
            meltdownProductFormID: craftingFormIDs.INGOTS.MALACHITE,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.MALACHITE
        },
        {
            name: 'DRAGONSCALE',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.DRAGON,
            meltdownProductFormID: craftingFormIDs.INGOTS.DRAGONBONE,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.DRAGONBONE
        },
        {
            name: 'STALHRIM',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.EBONY,
            meltdownProductFormID: craftingFormIDs.INGOTS.STALHRIM,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.STALHRIM
        },
        {
            name: 'WOOD',
            smithingPerkFormID: null,
            meltdownProductFormID: craftingFormIDs.INGOTS.CHARCOAL,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.FIREWOOD
        },
        {
            name: 'ADVANCED',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.ADVANCED,
            meltdownProductFormID: craftingFormIDs.INGOTS.CORONDUM,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.CORONDUM
        },
        {
            name: 'SILVER',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.SILVER,
            meltdownProductFormID: craftingFormIDs.INGOTS.SILVER,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.SILVER
        },
        {
            name: 'REFINED_SILVER',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.REFINED_SILVER,
            meltdownProductFormID: craftingFormIDs.INGOTS.SILVER,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.SILVER
        },
        {
            name: 'DRAUGR',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.STEEL,
            meltdownProductFormID: craftingFormIDs.INGOTS.STEEL,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.STEEL
        },
        {
            name: 'CHITIN',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.ADVANCED,
            meltdownProductFormID: craftingFormIDs.INGOTS.CORONDUM,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.CORONDUM
        },
        {
            name: 'GOLD',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.SILVER,
            meltdownProductFormID: craftingFormIDs.INGOTS.GOLD,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.GOLD
        },
        {
            name: 'BONEMOLD_HEAVY',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.ADVANCED,
            meltdownProductFormID: craftingFormIDs.INGOTS.IRON,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.IRON
        },
        {
            name: 'STEELPLATE',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.ADVANCED,
            meltdownProductFormID: craftingFormIDs.INGOTS.STEEL,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.STEEL
        },
        {
            name: 'FUR',
            smithingPerkFormID: null,
            meltdownProductFormID: craftingFormIDs.INGOTS.LEATHER_STRIPS,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.TANNING_RACK,
            temperingInputFormID: craftingFormIDs.INGOTS.LEATHER_STRIPS
        },
        {
            name: 'HIDE',
            smithingPerkFormID: null,
            meltdownProductFormID: craftingFormIDs.INGOTS.LEATHER_STRIPS,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.TANNING_RACK,
            temperingInputFormID: craftingFormIDs.INGOTS.LEATHER_STRIPS
        },
        {
            name: 'LEATHER',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.LEATHER,
            meltdownProductFormID: craftingFormIDs.INGOTS.LEATHER_STRIPS,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.TANNING_RACK,
            temperingInputFormID: craftingFormIDs.INGOTS.LEATHER_STRIPS
        },
        {
            name: 'SCALED',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.ADVANCED,
            meltdownProductFormID: craftingFormIDs.INGOTS.CORONDUM,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.TANNING_RACK,
            temperingInputFormID: craftingFormIDs.INGOTS.CORONDUM
        },
        {
            name: 'SCALED',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.ADVANCED,
            meltdownProductFormID: craftingFormIDs.INGOTS.CORONDUM,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.TANNING_RACK,
            temperingInputFormID: craftingFormIDs.INGOTS.CORONDUM
        },
        {
            name: 'STALHRIM_HEAVY',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.EBONY,
            meltdownProductFormID: craftingFormIDs.INGOTS.STALHRIM,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.STALHRIM
        },
        {
            name: 'STALHRIM_LIGHT',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.EBONY,
            meltdownProductFormID: craftingFormIDs.INGOTS.STALHRIM,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.STALHRIM
        },
        {
            name: 'NORDIC_HEAVY',
            smithingPerkFormID: craftingFormIDs.SMITHING_PERKS.ADVANCED,
            meltdownProductFormID: craftingFormIDs.INGOTS.CORONDUM,
            meltdownCraftingStationFormID: craftingFormIDs.CRAFTING_STATIONS.SMELTER,
            temperingInputFormID: craftingFormIDs.INGOTS.CORONDUM
        },
    ]; 
};