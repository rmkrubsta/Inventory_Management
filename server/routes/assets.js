const express = require('express');
const Asset = require('../models/Asset');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const search = String(req.query.search || '').trim();
    const filter = search
      ? { $or: ['name', 'assetId', 'location', 'category'].map((field) => ({ [field]: new RegExp(search, 'i') })) }
      : {};
    const assets = await Asset.find(filter).sort({ createdAt: -1 }).limit(100);
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

module.exports = router;
