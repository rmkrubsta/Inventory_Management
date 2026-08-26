const express = require('express');
const Asset = require('../models/Asset');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const search = String(req.query.search || '').trim();
    const filter = search
      ? { $or: ['name', 'assetId', 'location', 'category'].map((field) => ({ [field]: new RegExp(search, 'i') })) }
      : {};
    const assets = await Asset.find(filter).sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!asset) return res.status(404).json({ error: 'Asset not found.' });
    res.json(asset);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/report', async (req, res, next) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!asset) return res.status(404).json({ error: 'Asset not found.' });
    res.json({ asset, report: { type: req.body.type, details: req.body.details } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found.' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
