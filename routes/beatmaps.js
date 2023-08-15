const express = require('express');
const router = express.Router();

const beatmap_controller = require('../controllers/beatmapController');
const mode_controller = require('../controllers/modeController');

// Mode routes

router.get('/', mode_controller.index);

router.get('/m/create', mode_controller.mode_create_get);

router.post('/m/create', mode_controller.mode_create_post);

router.get('/m/:id/delete', mode_controller.mode_delete_get);

router.post('/m/:id/delete', mode_controller.mode_delete_post);

router.get('/m/:id/update', mode_controller.mode_update_get);

router.post('/m/:id/update', mode_controller.mode_update_post);

router.get('/m/:id', mode_controller.mode_specific_index);

// Beatmap routes

router.get('/b/create', beatmap_controller.beatmap_create_get);

router.post('/b/create', beatmap_controller.beatmap_create_post);

router.get('/b/:id/delete', beatmap_controller.beatmap_delete_get);

router.post('/b/:id/delete', beatmap_controller.beatmap_delete_post);

router.get('/b/:id/update', beatmap_controller.beatmap_update_get);

router.post('/b/:id/update', beatmap_controller.beatmap_update_post);

router.get('/b/:id', beatmap_controller.beatmap_detail);

module.exports = router;
