// controllers/subscriptionsController.js
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import { Subscription, User } from '../associations.js';

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return true; }
  return false;
};

export const listSubscriptions = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.plan) where.plan = req.query.plan;
    if (req.user && req.user.role === 'user') where.user_id = req.user.id;
    else if (req.query.user_id) where.user_id = req.query.user_id;

    const { rows, count } = await Subscription.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id','name','email'] }],
      order: [['starts_at','DESC']],
      offset, limit
    });

    res.json({ page, limit, total: count, pages: Math.ceil(count/limit), items: rows });
  } catch (err) {
    console.error('listSubscriptions', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createSubscription = async (req, res) => {
  if (handleValidation(req, res)) return;
  try {
    const { user_id, plan, price, starts_at, ends_at, status } = req.body;
    const finalUser = (req.user && req.user.role === 'user') ? req.user.id : (user_id || req.user.id);

    const u = await User.findByPk(finalUser);
    if (!u) return res.status(400).json({ message: 'User not found' });

    const sub = await Subscription.create({
      user_id: finalUser,
      plan,
      price,
      starts_at: starts_at || new Date(),
      ends_at: ends_at || null,
      status: status || 'active'
    });

    const out = await Subscription.findByPk(sub.id, { include: [{ model: User, as: 'user', attributes: ['id','name','email'] }] });
    res.status(201).json(out);
  } catch (err) {
    console.error('createSubscription', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubscription = async (req, res) => {
  try {
    const s = await Subscription.findByPk(req.params.id, { include: [{ model: User, as: 'user', attributes: ['id','name','email'] }] });
    if (!s) return res.status(404).json({ message: 'Subscription not found' });
    if (req.user && req.user.role === 'user' && s.user_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    res.json(s);
  } catch (err) {
    console.error('getSubscription', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSubscription = async (req, res) => {
  if (handleValidation(req, res)) return;
  try {
    const payload = {};
    ['plan','price','starts_at','ends_at','status'].forEach(k => { if (k in req.body) payload[k] = req.body[k]; });

    const s = await Subscription.findByPk(req.params.id);
    if (!s) return res.status(404).json({ message: 'Subscription not found' });

    if (!req.user || !['admin','superadmin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });

    await s.update(payload);
    const updated = await Subscription.findByPk(s.id, { include: [{ model: User, as: 'user', attributes: ['id','name','email'] }] });
    res.json({ message: 'Updated', subscription: updated });
  } catch (err) {
    console.error('updateSubscription', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    const s = await Subscription.findByPk(req.params.id);
    if (!s) return res.status(404).json({ message: 'Subscription not found' });
    if (!req.user || !['admin','superadmin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    await s.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteSubscription', err);
    res.status(500).json({ message: 'Server error' });
  }
};
