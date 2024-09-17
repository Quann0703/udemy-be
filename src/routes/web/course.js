const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/CourseController');

router.get('/', courseController.index);
router.post('/', courseController.store);
router.get('/:id/edit', courseController.edit);
router.patch('/:id', courseController.update);
router.delete('/:id', courseController.destroy);

module.exports = router;
