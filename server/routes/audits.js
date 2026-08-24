const express = require('express');
const Audit = require('../models/Audit');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const audits = await Audit.find().sort({ scheduledFor: 1 }).limit(100);
    res.json(audits);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const audit = await Audit.create(req.body);
    res.status(201).json(audit);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
