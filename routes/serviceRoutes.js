const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');
const serviceController = require('../controllers/serviceController');

// Service routes
router.get('/add', requireLogin, serviceController.getAddService);
router.post('/add', requireLogin, serviceController.postAddService);
router.get('/my', requireLogin, serviceController.getMyServices);
router.get('/:id', requireLogin, serviceController.getServiceById);
router.get('/:id/edit', requireLogin, serviceController.getEditService);
router.put('/:id', requireLogin, serviceController.updateService);
router.delete('/:id', requireLogin, serviceController.deleteService);

module.exports = router;