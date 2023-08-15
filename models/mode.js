const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

ModeSchema.virtual('url').get(function () {
  return `/beatmaps/m/${this._id}`;
});

module.exports = mongoose.model('Mode', ModeSchema);
