// controllers/projectsController.js
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import { Project, User } from '../associations.js'; // you said you have associations.js

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ errors: errors.array() }); return true; }
  return false;
};

export const listProjects = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1',10),1);
    const limit = Math.min(parseInt(req.query.limit || '20',10),100);
    const offset = (page-1)*limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.q) where.name = { [Op.like]: `%${req.query.q}%` };
    if (req.user && req.user.role === 'user') where.owner_id = req.user.id;
    else if (req.query.owner_id) where.owner_id = req.query.owner_id;

    const { rows, count } = await Project.findAndCountAll({
      where,
      include: [{ model: User, as: 'owner', attributes: ['id','name','email'] }],
      order: [['created_at','DESC']],
      offset, limit
    });

    res.json({ page, limit, total: count, pages: Math.ceil(count/limit), items: rows });
  } catch (err) {
    console.error('listProjects', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProject = async (req, res) => {
  if (handleValidation(req,res)) return;
  try {
    const { name, owner_id, description, status } = req.body;
    const ownerId = (req.user && req.user.role === 'user') ? req.user.id : (owner_id || req.user.id);
    const owner = await User.findByPk(ownerId);
    if (!owner) return res.status(400).json({ message: 'Owner not found' });

    const project = await Project.create({ name, owner_id: ownerId, description, status });
    const out = await Project.findByPk(project.id, { include: [{ model: User, as: 'owner', attributes: ['id','name','email'] }] });
    res.status(201).json(out);
  } catch (err) {
    console.error('createProject', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, { include: [{ model: User, as: 'owner', attributes: ['id','name','email'] }] });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (req.user && req.user.role === 'user' && project.owner_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    res.json(project);
  } catch (err) {
    console.error('getProject', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProject = async (req, res) => {
  if (handleValidation(req,res)) return;
  try {
    const payload = {};
    ['name','description','status','owner_id'].forEach(k=>{ if (k in req.body) payload[k]=req.body[k]; });

    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (req.user && req.user.role === 'user' && project.owner_id !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    if (payload.owner_id && !['admin','superadmin'].includes(req.user?.role)) delete payload.owner_id;
    if (payload.owner_id) {
      const newOwner = await User.findByPk(payload.owner_id);
      if (!newOwner) return res.status(400).json({ message: 'New owner not found' });
    }

    await project.update(payload);
    const updated = await Project.findByPk(project.id, { include: [{ model: User, as: 'owner', attributes: ['id','name','email'] }] });
    res.json({ message: 'Updated', project: updated });
  } catch (err) {
    console.error('updateProject', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    if (!(req.user && req.user.role === 'superadmin')) return res.status(403).json({ message: 'Forbidden' });
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteProject', err);
    res.status(500).json({ message: 'Server error' });
  }
};
