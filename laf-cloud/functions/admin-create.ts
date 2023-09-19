import cloud from '@lafjs/cloud';
const db = cloud.database();
const shared = cloud.shared;

const checkPermission = shared.get('checkPermission');
const hashPassword = shared.get('hashPassword');

export async function main(ctx: FunctionContext) {
  const { headers } = ctx;
  const token = headers['authorization'].split(' ')[1];
  const parsed = cloud.parseToken(token);
  const uid = parsed.uid;
  if (!uid) {
    return 'Unauthorized';
  }

  // check permission
  const code = await checkPermission(uid, 'admin.create');
  if (code) {
    return 'Permission denied';
  }

  // check params
  const { username, password, avatar, name, roles } = ctx.body;
  if (!username || !password) {
    return 'username & password cannot be empty';
  }

  // check exist
  const { total } = await db.collection('admin').where({ username }).count();
  if (total > 0) {
    return 'username already exists';
  }

  // check role validation
  const { total: valid_count } = await db
    .collection('role')
    .where({
      name: db.command.in(roles),
    })
    .count();

  if (valid_count !== roles.length) {
    return 'invalid roles';
  }

  // add admin
  const r = await db.collection('admin').add({
    username,
    name: name ?? null,
    avatar: avatar ?? null,
    roles: roles ?? [],
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  await db.collection('password').add({
    uid: r.id,
    password: hashPassword(password),
    type: 'admin',
    status: 'active',
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  return {
    code: 0,
    result: r,
  };
}
