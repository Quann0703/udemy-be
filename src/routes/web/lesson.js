const express = require('express');
const router = express.Router();
const lessonController = require('../../controllers/LessonController');

router.get('/', lessonController.index);
router.post('/', lessonController.store);
router.get('/:id/edit', lessonController.edit);
router.patch('/:id', lessonController.update);
router.delete('/:id', lessonController.destroy);

module.exports = router;
