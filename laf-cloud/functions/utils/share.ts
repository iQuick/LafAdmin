import cloud from '@lafjs/cloud';
import * as crypto from 'crypto';
import { PERMISSION, UNAUTHORIZED, USER_TOKEN_EXPIRE, USER_TOKEN_INVALID } from '@/system/fail';

const db = cloud.database();

/**
 * @params token 用户 token
 */
export async function checkToken(ctx: FunctionContext): Promise<any> {
  const authorization = ctx.headers['authorization'];
  if (!authorization) {
    return UNAUTHORIZED;
  }

  const tks = authorization.split(' ');
  if (tks.length !== 2 || tks[0] !== 'Bearer') {
    return UNAUTHORIZED;
  }

  const payload = cloud.parseToken(tks[1]);
  if (!payload || !payload.uid) {
    return USER_TOKEN_INVALID;
  }

  const { path } = ctx.request;
  if (!(
    (path.startsWith('/cms/') && payload.type === 'admin') ||
    (path.startsWith('/api/') && payload.type === 'user')
  )) {
    return USER_TOKEN_INVALID;
  }

  if (payload.type === 'user') {
    // 用户需检查 user-token 看 Token 是否被禁用或删除
    const { data: utoken } = await db
      .collection('user-token')
      .where({ uid: payload.uid, token: payload.token })
      .getOne()
    if (!utoken || !utoken.status) {
      return USER_TOKEN_INVALID;
    }
  }

  if (payload.expired_at > Date.now()) {
    return USER_TOKEN_EXPIRE;
  }

  return { code: 0, ...payload };
}

/**
 * 判断用户是否有权限
 * @param uid 用户ID
 * @param permission 权限名
 * @returns 0 表示用户有权限， UNAUTHORIZED 表示用户未登录， PERMISSION 表示用户未授权
 */
export async function checkPermission(uid: string, permission: string): Promise<any> {
  if (!uid) {
    return UNAUTHORIZED;
  }

  const { permissions } = await getPermissions(uid);
  if (!permissions.includes(`pms.${permission}`)) {
    return PERMISSION;
  }
  return { code: 0 };
}

/**
 * 通过 user id 获取权限列表
 * @param role_ids
 * @returns
 */
export async function getPermissions(uid: string) {
  const db = cloud.database();
  // 查用户
  const { data: admin } = await db.collection('admin').where({ _id: uid, status: 1 }).getOne();

  // 查角色
  const { data: roles } = await db
    .collection('role')
    .where({
      name: {
        $in: admin.roles ?? [],
      },
      status: 1
    })
    .get();

  if (!roles) {
    return { permissions: [], roles: [], user: admin };
  }

  const disenablePermissions = (
    await db
      .collection('permission')
      .where({ status: 0 })
      .limit(1000)
      .get()
  ).data.map(item => {
    return item.name;
  });

  const permissions = [];
  for (const role of roles) {
    const perms = role.permissions.filter(item => {
      return !disenablePermissions.includes(item);
    }) ?? [];
    permissions.push(...perms);
  }

  return {
    permissions,
    roles: roles.map((role) => role.name),
    user: admin,
  };
}

/**
 * @param {string} content
 * @return {string}
 */
export function hashPassword(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}
