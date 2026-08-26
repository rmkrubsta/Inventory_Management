const express = require('express');
const Asset = require('../models/Asset');
const Maintenance = require('../models/Maintenance');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const workOrders = await Maintenance.find().sort({ createdAt: -1 }).limit(100);
    res.json(workOrders);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const workOrder = await Maintenance.create(req.body);
    await Asset.updateOne({ assetId: workOrder.assetId }, { $set: { status: 'Maintenance' } });
    res.status(201).json(workOrder);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/resolve', async (req, res, next) => {
  try {
    const workOrder = await Maintenance.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true });
    if (!workOrder) return res.status(404).json({ error: 'Maintenance work order not found.' });
    await Asset.updateOne({ assetId: workOrder.assetId }, { $set: { status: 'Available' } });
    res.json(workOrder);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
