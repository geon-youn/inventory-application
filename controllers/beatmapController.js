const Mode = require('../models/mode');
const Beatmap = require('../models/beatmap');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.beatmap_detail = asyncHandler(async (req, res, next) => {
  const currentBeatmap = await Beatmap.findById(req.params.id)
    .populate('mode')
    .exec();

  res.render('beatmap_detail', {
    title: `${currentBeatmap.author} - ${currentBeatmap.name}`,
    beatmap: currentBeatmap,
  });
});

exports.beatmap_create_get = asyncHandler(async (req, res, next) => {
  const allModes = await Mode.find().sort({ name: 1 }).exec();

  res.render('beatmap_form', { title: 'Create Beatmap', modes: allModes });
});

exports.beatmap_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Song name must be specified'),
  body('author')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Author must be specified'),
  body('mapper')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Mapper must be specified'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Description name must be specified'),
  body('mode')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Mode must be specified'),
  body('status')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Status must be specified'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const beatmap = new Beatmap({
      name: req.body.name,
      author: req.body.author,
      mapper: req.body.mapper,
      description: req.body.description,
      mode: req.body.mode,
      status: req.body.status,
    });

    if (!errors.isEmpty()) {
      const allModes = await Mode.find().sort({ name: 1 }).exec();
      res.render('beatmap_form', {
        title: 'Create Beatmap',
        beatmap: beatmap,
        modes: allModes,
        errors: errors.array(),
      });
    } else {
      await beatmap.save();
      res.redirect(beatmap.url);
    }
  }),
];

exports.beatmap_delete_get = asyncHandler(async (req, res, next) => {
  const currentBeatmap = await Beatmap.findById(req.params.id).exec();

  res.render('beatmap_delete', {
    title: `Delete confirmation for ${currentBeatmap.fullname}`,
    beatmap: currentBeatmap,
  });
});

exports.beatmap_delete_post = asyncHandler(async (req, res, next) => {
  await Beatmap.findByIdAndRemove(req.body.beatmapid);
  res.redirect('/beatmaps');
});

exports.beatmap_update_get = asyncHandler(async (req, res, next) => {
  const [currentBeatmap, allModes] = await Promise.all([
    Beatmap.findById(req.params.id).exec(),
    Mode.find().sort({ name: 1 }).exec(),
  ]);

  res.render('beatmap_form', {
    title: `Update ${currentBeatmap.fullname}`,
    modes: allModes,
    beatmap: currentBeatmap,
  });
});

exports.beatmap_update_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Song name must be specified'),
  body('author')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Author must be specified'),
  body('mapper')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Mapper must be specified'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Description name must be specified'),
  body('mode')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Mode must be specified'),
  body('status')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Status must be specified'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const beatmap = new Beatmap({
      name: req.body.name,
      author: req.body.author,
      mapper: req.body.mapper,
      description: req.body.description,
      mode: req.body.mode,
      status: req.body.status,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allModes = await Mode.find().sort({ name: 1 }).exec();
      res.render('beatmap_form', {
        title: `Update ${beatmap.fullname}`,
        beatmap: beatmap,
        modes: allModes,
        errors: errors.array(),
      });
    } else {
      const updatedMap = await Beatmap.findByIdAndUpdate(
        req.params.id,
        beatmap,
        {}
      );
      res.redirect(updatedMap.url);
    }
  }),
];
