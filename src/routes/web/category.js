const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/CategoryController');

router.get('/', categoryController.index);
router.post('/', categoryController.store);
router.get('/:id/edit', categoryController.edit);
router.patch('/:id', categoryController.update);
router.delete('/:id', categoryController.destroy);

module.exports = router;
