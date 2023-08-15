const Mode = require('../models/mode');
const Beatmap = require('../models/beatmap');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
  const [allBeatmaps, allModes] = await Promise.all([
    Beatmap.find().populate('mode').sort({ name: 1 }).exec(),
    Mode.find().sort({ name: 1 }).exec(),
  ]);

  res.render('index', {
    title: 'All Beatmaps',
    beatmaps: allBeatmaps,
    modes: allModes,
  });
});

exports.mode_specific_index = asyncHandler(async (req, res, next) => {
  const [specificModeBeatmaps, allModes, currentMode] = await Promise.all([
    Beatmap.find({ mode: req.params.id })
      .populate('mode')
      .sort({ name: 1 })
      .exec(),
    Mode.find().sort({ name: 1 }).exec(),
    Mode.findById(req.params.id).exec(),
  ]);

  res.render('index', {
    title: `All ${currentMode.name} Beatmaps`,
    beatmaps: specificModeBeatmaps,
    modes: allModes,
    currentMode: currentMode,
  });
});

exports.mode_create_get = asyncHandler(async (req, res, next) => {
  res.render('mode_form', { title: 'Create Mode' });
});

exports.mode_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Mode name must be specified'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Description must be specified'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const mode = new Mode({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render('mode_form', {
        title: 'Create Mode',
        mode: mode,
        errors: errors.array(),
      });
    }

    const modeExists = await Mode.findOne({ name: req.body.name })
      .collation({ locale: 'en', strength: 2 })
      .exec();

    if (modeExists) {
      res.redirect(modeExists.url);
    } else {
      await mode.save();
      res.redirect(mode.url);
    }
  }),
];

exports.mode_delete_get = asyncHandler(async (req, res, next) => {
  const [currentMode, beatmapsOfCurrentMode] = await Promise.all([
    Mode.findById(req.params.id).exec(),
    Beatmap.find({ mode: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  res.render('mode_delete', {
    title: `Delete ${currentMode.name}`,
    currentMode: currentMode,
    beatmaps: beatmapsOfCurrentMode,
  });
});

exports.mode_delete_post = asyncHandler(async (req, res, next) => {
  const [currentMode, beatmapsOfCurrentMode] = await Promise.all([
    Mode.findById(req.params.id).exec(),
    Beatmap.find({ mode: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  if (beatmapsOfCurrentMode.length > 0) {
    res.render('mode_delete', {
      title: `Delete ${currentMode.name}`,
      currentMode: currentMode,
      beatmaps: beatmapsOfCurrentMode,
    });
  } else {
    await Mode.findByIdAndRemove(req.body.modeid);
    res.redirect('/beatmaps');
  }
});

exports.mode_update_get = asyncHandler(async (req, res, next) => {
  const currentMode = await Mode.findById(req.params.id).exec();

  res.render('mode_form', {
    title: `Update ${currentMode.name}`,
    mode: currentMode,
  });
});

exports.mode_update_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Mode name must be specified'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Description must be specified'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const mode = new Mode({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('mode_form', {
        title: `Update ${mode.name}`,
        mode: mode,
        errors: errors.array(),
      });
    }

    const modeExists = await Mode.findOne({ name: req.body.name })
      .collation({ locale: 'en', strength: 2 })
      .exec();

    if (modeExists && modeExists._id.toString() !== mode._id.toString()) {
      res.redirect(modeExists.url);
    } else {
      const updatedMode = await Mode.findByIdAndUpdate(req.params.id, mode, {});
      res.redirect(updatedMode.url);
    }
  }),
];
