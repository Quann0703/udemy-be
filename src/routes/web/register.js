const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/RegisterController');

router.get('/', registerController.index);
router.post('/', registerController.store);
router.get('/:id/edit', registerController.edit);
router.patch('/:id', registerController.update);
router.delete('/:id', registerController.destroy);

module.exports = router;
