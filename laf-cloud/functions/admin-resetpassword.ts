import cloud from '@lafjs/cloud';

const db = cloud.database();
const checkPermission = cloud.shared.get('checkPermission');
const hashPassword = cloud.shared.get('hashPassword');

export async function main(ctx: FunctionContext) {

  const { headers } = ctx;
  const token = headers['authorization'].split(' ')[1];
  const parsed = cloud.parseToken(token);
  const uid = parsed.uid;
  if (!uid) {
    return 'Unauthorized';
  }

  // 权限验证
  const code = await checkPermission(uid, 'admin.edit');
  if (code) {
    return { code: '403', error: 'Permission denied' };
  }

  const { _id, username, password } = ctx.body;


  if (!username || !password)
    return {
      code: 'INVALID_PARAM',
      error: 'id and username and password and newpassword not be empty',
    };

  const { data: admin } = await db
    .collection('admin')
    .where({ _id, username })
    .withOne({
      query: db.collection('password').where({ type: 'admin' }),
      localField: '_id',
      foreignField: 'uid',
      as: 'password',
    })
    .getOne();

  // update password
  await db
    .collection('password')
    .where({ uid: admin._id, type: 'admin', status: 'active' })
    .update({
      status: 'inactive',
      updated_at: Date.now(),
    });

  await db.collection('password').add({
    uid: admin._id,
    password: hashPassword(password),
    type: 'admin',
    status: 'active',
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  return {
    code: 0,
    result: 'success',
  };
}
