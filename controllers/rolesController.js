// controllers/rolesController.js
import Role from '../models/Role.js';
import Permission from '../models/Permission.js';

export const listRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{ model: Permission, through: { attributes: [] } }]
    });
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name required' });
    const existing = await Role.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: 'Role exists' });
    const role = await Role.create({ name, description });
    res.status(201).json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    await role.update({ name: name || role.name, description: description || role.description });
    res.json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    await role.destroy();
    res.json({ message: 'Role deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const setRolePermissions = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    const { permissions } = req.body; // array of permission names or ids
    if (!Array.isArray(permissions)) return res.status(400).json({ message: 'permissions must be array' });

    const permInstances = [];
    for (const p of permissions) {
      let perm;
      if (typeof p === 'number') perm = await Permission.findByPk(p);
      else perm = await Permission.findOne({ where: { name: p } });

      if (!perm) {
        if (typeof p === 'string') {
          perm = await Permission.create({ name: p });
        } else {
          continue;
        }
      }
      permInstances.push(perm);
    }

    await role.setPermissions(permInstances);
    const updated = await Role.findByPk(role.id, {
      include: [{ model: Permission, through: { attributes: [] } }]
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
