import cloud from '@lafjs/cloud'

const db = cloud.database();

/**
 * 预置 RBAC 权限
 */
const permissions = [
  { name: 'role', label: '角色管理' },
  { name: 'role.create', label: '创建角色' },
  { name: 'role.read', label: '读取角色' },
  { name: 'role.edit', label: '编辑角色' },
  { name: 'role.delete', label: '删除角色' },

  { name: 'permission', label: '权限管理' },
  { name: 'permission.create', label: '创建权限' },
  { name: 'permission.read', label: '读取权限' },
  { name: 'permission.edit', label: '编辑权限' },
  { name: 'permission.delete', label: '删除权限' },

  { name: 'user', label: '用户' },
  { name: 'user.create', label: '创建用户' },
  { name: 'user.read', label: '获取用户' },
  { name: 'user.edit', label: '编辑用户' },
  { name: 'user.delete', label: '删除用户' },

  { name: 'user.token', label: '用户Token' },
  { name: 'user.token.create', label: '创建用户Token' },
  { name: 'user.token.read', label: '获取用户Token' },
  { name: 'user.token.edit', label: '编辑用户Token' },
  { name: 'user.token.delete', label: '删除用户Token' },

  { name: 'admin', label: '管理员' },
  { name: 'admin.create', label: '创建管理员' },
  { name: 'admin.read', label: '获取管理员' },
  { name: 'admin.edit', label: '编辑管理员' },
  { name: 'admin.delete', label: '删除管理员' },

  { name: 'schema', label: '内容模型' },
  { name: 'schema.create', label: '创建内容模型' },
  { name: 'schema.read', label: '读取内容模型' },
  { name: 'schema.edit', label: '编辑内容模型' },
  { name: 'schema.delete', label: '删除内容模型' },

  { name: 'schema.api', label: '内容模型接口' },
  { name: 'schema.api.read', label: '读取内容模型接口' },
  { name: 'schema.api.edit', label: '编辑内容模型接口' },

  { name: 'oss.manager', label: '资源管理' },
  { name: 'oss.manager.read', label: '读取资源文件' },
  { name: 'oss.manager.delete', label: '删除资源文件' },

  { name: 'system.setting', label: '系统设置' },
  { name: 'system.setting.read', label: '读取系统设置' },
  { name: 'system.setting.edit', label: '修改系统设置' },
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

