import Role from '../models/Role.js';
import Permission from '../models/Permission.js';

export const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

      // If user's role is superadmin, allow immediately
      if (req.user.role === 'superadmin') return next();

      // Try to find Role model by name matching user's role string
      const role = await Role.findOne({
        where: { name: req.user.role },
        include: [{ model: Permission, through: { attributes: [] } }]
      });

      if (!role) return res.status(403).json({ message: 'Role not configured' });

      const perms = (role.Permissions || []).map(p => p.name);
      if (perms.includes(permissionName)) return next();

      return res.status(403).json({ message: 'Forbidden: permission required' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
};
