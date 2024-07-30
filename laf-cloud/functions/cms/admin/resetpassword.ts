import cloud from '@lafjs/cloud';
import { checkPermission, checkToken, hashPassword } from '@/system/sys';
import { ok, fail } from '@/system/call';
import { PARAMS_EMPTY } from '@/system/fail';

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

  const { _id, username, password } = ctx.body;

  if (!username || !password) {
    return fail(PARAMS_EMPTY);
  }

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

  return ok('success');
}
