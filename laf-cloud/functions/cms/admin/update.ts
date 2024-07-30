import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken, hashPassword } from '@/system/sys';
import { ACCOUNT_ALREADY_EXIST, INVALID_ADMIN, INVALID_ROLE, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'admin.edit');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // 参数验证
  const { _id, username, password, avatar, name, roles } = ctx.body;
  if (!_id) {
    return fail(PARAMS_EMPTY);
  }

  // 验证 user _id 是否合法
  const { data: admin } = await db.collection('admin').where({ _id: _id }).getOne();
  if (!admin) {
    return fail(INVALID_ADMIN);
  }

  // 验证 roles 是否合法
  const { total: valid_count } = await db
    .collection('role')
    .where({
      name: db.command.in(roles),
    })
    .count();

  if (valid_count !== roles.length) {
    return fail(INVALID_ROLE);
  }

  const old = admin;

  // update admim
  const data = { updated_at: Date.now() };

  // update password
  if (password) {
    data['password'] = hashPassword(password);
  }

  // username
  if (username && username != old.username) {
    const { total } = await db.collection('admin').where({ username }).count();
    if (total) {
      return fail(ACCOUNT_ALREADY_EXIST);
    }
    data['username'] = username;
  }

  // avatar
  if (avatar && avatar != old.avatar) {
    data['avatar'] = avatar;
  }

  // name
  if (name && name != old.name) {
    data['name'] = name;
  }

  // roles
  if (roles) {
    data['roles'] = roles;
  }

  const rsp = await db
    .collection('admin')
    .where({ _id: _id })
    .update({
      ...data,
      updated_at: Date.now(),
    });

  return ok({
    _id,
    ...rsp,
  });
}
