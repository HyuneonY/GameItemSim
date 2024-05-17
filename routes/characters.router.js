import express from 'express';
import Character from '../schemas/characters.schema.js';
import Item from '../schemas/items.schema.js';

const router = express.Router();

router.post('/characters', async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ message: 'Invalid request: Name is required' });
    }
    const { name } = req.body;
    const prevCharacter = await Character.findOne().sort('-characterId').exec();

    if (prevCharacter && name === prevCharacter.name) {
      return res.status(400).json({
        message: 'Duplicate name: A character with this name already exists',
      });
    }

    const characterId = prevCharacter ? prevCharacter.characterId + 1 : 1;
    const character = new Character({
      name,
      characterId,
    });

    await character.save();

    return res.status(201).json({ characterId });
  } catch (error) {
    console.log('Failed to create character', error);
    res
      .status(500)
      .json({ message: 'Sever error: Failed to create character' });
  }
});

router.delete('/characters/:characterId', async (req, res) => {
  try {
    const characterId = parseInt(req.params.characterId, 10);
    const character = await Character.findOne({
      characterId,
    }).exec();

    if (!character) {
      return res
        .status(400)
        .json({ message: `Character with Id ${characterId} not found` });
    }
    await Character.deleteOne({ characterId }).exec();
    return res.status(200).json({ message: 'Character deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Server error: failed to delete character' });
  }
});

router.get('/characters/:characterId', async (req, res) => {
  try {
    const characterId = parseInt(req.params.characterId, 10);
    const character = await Character.findOne({
      characterId,
    }).exec();

    if (!character) {
      return res
        .status(400)
        .json({ message: `Character with Id ${characterId} not found` });
    }

    return res.status(200).json({
      name: character.name,
      health: character.health,
      power: character.power,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Server error: failed to delete character' });
  }
});

router.get('/characters/:characterId/items', async (req, res) => {
  try {
    const characterId = parseInt(req.params.characterId, 10);
    const character = await Character.findOne({ characterId })
      .populate('equippedItems')
      .exec();

    if (!character) {
      return res.status(404).json({ message: `Character not found` });
    }

    const items = character.equippedItems.map((item) => ({
      itemCode: item.itemCode,
      itemName: item.itemName,
    }));

    return res.status(200).json(items);
  } catch (error) {
    console.error('Error retrieving character items', error);
    res.status(500).json({
      message: 'Server error: Failed to get character equipped items',
    });
  }
});

router.post('/characters/:characterId/equip', async (req, res) => {
  try {
    const characterId = parseInt(req.params.characterId, 10);
    const { itemCode } = req.body;

    const character = await Character.findOne({ characterId })
      .populate('equippedItems')
      .exec();

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    const isItemEquipped = character.equippedItems.some(
      (item) => item.itemCode === itemCode
    );

    if (isItemEquipped) {
      return res.status(400).json({ message: 'Item is already equipped' });
    }

    const itemToEquip = await Item.findOne({ itemCode });
    character.health += itemToEquip.itemStat.health ?? 0;
    character.power += itemToEquip.itemStat.power ?? 0;
    character.equippedItems.push(itemToEquip);

    await character.save();

    return res.status(200).json({
      message: 'Item equipped successfully',
      character: {
        name: character.name,
        health: character.health,
        pwoer: character.power,
        equippedItems: character.equippedItems.map((item) => ({
          itemCode: item.itemCode,
          itemName: item.itemName,
        })),
      },
    });
  } catch (error) {
    console.error('Error equipping item', error);
    return res.status(500).json({
      message: 'Server error: Failed to equip item',
    });
  }
});

router.post('/characters/:characterId/unequip', async (req, res) => {
    try {
      const characterId = parseInt(req.params.characterId, 10);
      const { itemCode } = req.body;
  
      const character = await Character.findOne({ characterId })
        .populate('equippedItems')
        .exec();
  
      if (!character) {
        return res.status(404).json({ message: 'Character not found' });
      }
  
      const itemIndex = character.equippedItems.findIndex(
        item => item.itemCode === itemCode
      );
  
      if (itemIndex === -1) {
        return res.status(400).json({ message: 'Item is not equipped' });
      }
  
      const itemToUnequip = character.equippedItems[itemIndex];
      character.health -= itemToUnequip.itemStat.health ?? 0;
      character.power -= itemToUnequip.itemStat.power ?? 0;
      character.equippedItems.splice(itemIndex, 1);
  
      await character.save();
  
      return res.status(200).json({
        message: 'Item unequipped successfully',
        character: {
          name: character.name,
          health: character.health,
          pwoer: character.power,
          equippedItems: character.equippedItems.map((item) => ({
            itemCode: item.itemCode,
            itemName: item.itemName,
          })),
        },
      });
    } catch (error) {
      console.error('Error unequipping item', error);
      return res.status(500).json({
        message: 'Server error: Failed to unequip item',
      });
    }
  });

export default router;
