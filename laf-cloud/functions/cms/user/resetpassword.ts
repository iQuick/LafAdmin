import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission, hashPassword } from '@/system/sys';
import { PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'user.edit');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { _id, username, password } = ctx.body;
  if (!_id || !username || !password) {
    return fail(PARAMS_EMPTY);
  }
  const { data: user } = await db
    .collection('user')
    .where({ _id, username })
    .withOne({
      query: db.collection('password').where({ type: 'user' }),
      localField: '_id',
      foreignField: 'uid',
      as: 'password',
    })
    .getOne();

  // update password
  await db.collection('password').where({ uid: user._id, type: 'user', status: 'active' }).update({
    status: 'inactive',
    updated_at: Date.now(),
  });

  await db.collection('password').add({
    uid: user._id,
    password: hashPassword(password),
    type: 'user',
    status: 'active',
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  return ok('success');
}
