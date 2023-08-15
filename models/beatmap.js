const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BeatmapSchema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  mapper: { type: String, required: true },
  status: {
    type: String,
    requried: true,
    enum: [
      'Ranked',
      'Qualified',
      'Loved',
      'Favourites',
      'Pending',
      'WIP',
      'Graveyard',
    ],
    default: 'Graveyard',
  },
  description: { type: String, required: true },
  mode: { type: Schema.Types.ObjectId, ref: 'Mode', required: true },
});

BeatmapSchema.virtual('url').get(function () {
  return `/beatmaps/b/${this._id}`;
});

BeatmapSchema.virtual('fullname').get(function () {
  return `${this.author} - ${this.name} [${this.mapper}]`
})

module.exports = mongoose.model('Beatmap', BeatmapSchema);
