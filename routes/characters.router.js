import express from 'express';
import Character from '../schemas/characters.schema.js';

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

    return res
      .status(200)
      .json({
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

export default router;