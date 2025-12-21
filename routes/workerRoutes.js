const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');
const workerController = require('../controllers/workerController');

// Worker routes - ORDER MATTERS!
router.get('/add', requireLogin, workerController.getAddWorker);
router.post('/add', requireLogin, workerController.postAddWorker);
// My workers route must come BEFORE :id route to avoid conflict
router.get('/my', requireLogin, workerController.getMyWorkers);
router.get('/:id', requireLogin, workerController.getWorkerById);
router.get('/:id/edit', requireLogin, workerController.getEditWorker);
router.put('/:id', requireLogin, workerController.updateWorker);
router.delete('/:id', requireLogin, workerController.deleteWorker);

module.exports = router;