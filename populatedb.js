#! /usr/bin/env node

console.log(
  'This script populates the Mongo Atlas database using the given connection url stored in process.env.MONGODB'
);

const Mode = require('./models/mode');
const Beatmap = require('./models/beatmap');

const modes = [];
const beatmaps = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

require('dotenv').config();
const mongoDB = process.env.MONGODB;

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createModes();
  await createBeatmaps();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// mode[0] will always be the osu! mode, regardless of the order
// in which the elements of promise.all's argument complete.
async function modeCreate(index, name, description) {
  const mode = new Mode({ name, description });
  await mode.save();
  modes[index] = mode;
  console.log(`Added mode: ${name}`);
}

async function beatmapCreate(
  index,
  name,
  description,
  author,
  mapper,
  status,
  mode
) {
  const beatmap = new Beatmap({
    name,
    description,
    author,
    mapper,
    status,
    mode,
  });
  await beatmap.save();
  beatmaps[index] = beatmap;
  console.log(`Added beatmap: ${author} - ${name}`);
}

async function createModes() {
  console.log('Adding modes');
  await Promise.all([
    modeCreate(
      0,
      'osu!',
      "osu! is the default mode, where players are expected to tap circles, hold sliders, and spin spinners to the beat of the music. It is based on the original iNiS' rhythm game Osu! Tatakae! Ouendan. osu! has its own mascot called pippi, a pink/black-haired girl."
    ),
    modeCreate(
      1,
      'osu!taiko',
      "osu!taiko simulates the process of playing a real drum, where players make use of a keyboard or drum kit to hit differently-coloured circles on a single conveyor. It is based on the Taiko no Tatsujin game series produced by Bandai Namco Entertainment. osu!taiko's mascot is Mocha, a green-haired girl in a kimono holding drumsticks."
    ),
    modeCreate(
      2,
      'osu!catch',
      "In osu!catch, fruits of differing varieties fall from the top of the screen, and the player must catch them to the beat. To this end they control a catcher with a plate atop their head for catching said fruits. This mode is loosely based on a minigame inside of a Beatmania simulator, which itself is believed to be based on the EZ2CATCH mode from the EZ2DJ series. osu!catch's mascot is Yuzu, a blue-haired boy."
    ),
    modeCreate(
      3,
      'osu!mania',
      "osu!mania is a vertical scrolling rhythm game (VSRG) mode designed as a piano simulator. It was chiefly introduced and implemented by woc2006, and is based on a variety of conveyor-type rhythm games (namely Dance Dance Revolution and Beatmania). osu!mania's mascots are the twins Mani and Mari, both with purple and light purple hair."
    ),
  ]);
}

async function createBeatmaps() {
  console.log('Adding beatmaps');
  await Promise.all([
    beatmapCreate(
      0,
      'Take a Hint feat. Victoria Justice & Elizabeth Gillies (Sped Up & Cut Ver.)',
      "「 She's Not Interested 」",
      'Victorious Cast',
      'Kibitz',
      'Ranked',
      modes[3]
    ),
    beatmapCreate(
      1,
      "Rubik's Cube",
      "this is the rearranged rubik's cube\n5h map\n\nhitsound:\ntop - by lalarun\nothers - by yf_bmp",
      'Nanahoshi Kangengakudan',
      'Ryuusei Aika',
      'Ranked',
      modes[0]
    ),
    beatmapCreate(
      2,
      'IDOL',
      'Thanks for the support despite the problems I have caused, I love you guys :D',
      'YOASOBI',
      'gaston_2199',
      'Ranked',
      modes[1]
    ),
    beatmapCreate(
      3,
      'Cookie-Butter-Choco-Cookie',
      'I have a butt-',
      'Elmo and Cookie Monster',
      'Monstrata',
      'Ranked',
      modes[2]
    ),
    beatmapCreate(
      4,
      "Gucci Gucci Literature Club's Not Hot (ft. Monika)",
      'by shardex',
      'Miraie',
      'stq',
      'Loved',
      modes[0]
    ),
  ]);
}
