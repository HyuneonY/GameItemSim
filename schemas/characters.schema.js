import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema({
  characterId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  health: {
    type: Number,
    default: 500,
  },
  power: {
    type: Number,
    default: 100,
  },
});

export default mongoose.model('Character', CharacterSchema);