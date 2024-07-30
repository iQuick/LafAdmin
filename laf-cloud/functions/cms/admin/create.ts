import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, hashPassword, checkToken } from '@/system/sys';
import { ACCOUNT_ALREADY_EXIST, ACCOUNT_PASSWD_EMPTY, ROLES } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'admin.create');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // check params
  const { username, password, avatar, name, roles } = ctx.body;
  if (!username || !password) {
    return fail(ACCOUNT_PASSWD_EMPTY);
  }

  // check exist
  const { total } = await db.collection('admin').where({ username }).count();
  if (total > 0) {
    return fail(ACCOUNT_ALREADY_EXIST);
  }

  // check role validation
  const { total: valid_count } = await db
    .collection('role')
    .where({
      name: db.command.in(roles),
    })
    .count();

  if (valid_count !== roles.length) {
    return fail(ROLES);
  }

  // add admin
  const rsp = await db.collection('admin').add({
    username,
    name: name ?? null,
    avatar: avatar ?? null,
    roles: roles ?? [],
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  await db.collection('password').add({
    uid: rsp.id,
    password: hashPassword(password),
    type: 'admin',
    status: 'active',
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  return ok(rsp);
}
