// controllers/permissionsController.js
import Permission from '../models/Permission.js';

export const listPermissions = async (req, res) => {
  try {
    const perms = await Permission.findAll();
    res.json(perms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const existing = await Permission.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: 'Permission exists' });
    const p = await Permission.create({ name, description });
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const p = await Permission.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Permission not found' });
    await p.destroy();
    res.json({ message: 'Permission deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
