import cloud from '@lafjs/cloud'

const db = cloud.database();

/**
 * 预置 RBAC 权限
 */
const permissions = [
  { name: 'pms.menu.role', label: '角色菜单' }, 
  { name: 'pms.menu.permission', label: '权限菜单' },
  { name: 'pms.menu.user', label: '用户菜单' },
  { name: 'pms.menu.user.token', label: '用户 Token 菜单' },
  { name: 'pms.menu.admin', label: '管理员菜单' },
  { name: 'pms.menu.content', label: '内容菜单' },
  { name: 'pms.menu.schema', label: '内容模型菜单' },
  { name: 'pms.menu.schema.api', label: '内容模型接口菜单' },
  { name: 'pms.menu.oss.manager', label: '资源管理菜单' },
  { name: 'pms.menu.system.setting', label: '系统设置菜单' },

  { name: 'pms.role.create', label: '创建角色' },
  { name: 'pms.role.read', label: '读取角色' },
  { name: 'pms.role.edit', label: '编辑角色' },
  { name: 'pms.role.delete', label: '删除角色' },

  { name: 'pms.permission.create', label: '创建权限' },
  { name: 'pms.permission.read', label: '读取权限' },
  { name: 'pms.permission.edit', label: '编辑权限' },
  { name: 'pms.permission.delete', label: '删除权限' },

  { name: 'pms.user.create', label: '创建用户' },
  { name: 'pms.user.read', label: '获取用户' },
  { name: 'pms.user.edit', label: '编辑用户' },
  { name: 'pms.user.delete', label: '删除用户' },

  { name: 'pms.user.token.create', label: '创建用户 Token' },
  { name: 'pms.user.token.read', label: '获取用户 Token' },
  { name: 'pms.user.token.edit', label: '编辑用户 Token' },
  { name: 'pms.user.token.delete', label: '删除用户 Token' },

  { name: 'pms.user.token.create', label: '创建用户Token' },
  { name: 'pms.user.token.read', label: '获取用户Token' },
  { name: 'pms.user.token.edit', label: '编辑用户Token' },
  { name: 'pms.user.token.delete', label: '删除用户Token' },

  { name: 'pms.admin.create', label: '创建管理员' },
  { name: 'pms.admin.read', label: '获取管理员' },
  { name: 'pms.admin.edit', label: '编辑管理员' },
  { name: 'pms.admin.delete', label: '删除管理员' },

  { name: 'pms.schema.create', label: '创建内容模型' },
  { name: 'pms.schema.read', label: '读取内容模型' },
  { name: 'pms.schema.edit', label: '编辑内容模型' },
  { name: 'pms.schema.delete', label: '删除内容模型' },

  { name: 'pms.schema.api.create', label: '创建内容模型接口' },
  { name: 'pms.schema.api.read', label: '读取内容模型接口' },
  { name: 'pms.schema.api.edit', label: '编辑内容模型接口' },
  { name: 'pms.schema.api.delete', label: '删除内容模型接口' },

  { name: 'pms.oss.manager.create', label: '创建资源文件' },
  { name: 'pms.oss.manager.read', label: '读取资源文件' },
  { name: 'pms.oss.manager.edit', label: '编辑资源文件' },
  { name: 'pms.oss.manager.delete', label: '删除资源文件' },

  { name: 'pms.system.setting.read', label: '读取系统设置' },
  { name: 'pms.system.setting.edit', label: '修改系统设置' },
];


// 创建初始权限
export default async function configPermission() {
  // 创建唯一索引
  await cloud.mongo.db.collection('permission').createIndex('name', { unique: true });
  for (const perm of permissions) {
    try {
      const data = {
        ...perm,
        status: 1,
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      await db.collection('permission').add(data);
    } catch (error) {
      if (error.code == 11000) {
        console.log('permissions already exists');
        continue;
      }
    }
  }
}

