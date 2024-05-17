import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  itemCode: {
    type: Number,
    unique: true,
  },
  itemName: {
    type: String,
    require: true,
  },
  itemStat: {
    health: {
      type: Number,
      require: true,
    },
    power: {
      type: Number,
      require: true,
    },
  },
});

export default mongoose.model('Item', ItemSchema);