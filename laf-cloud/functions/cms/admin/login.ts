import cloud from '@lafjs/cloud';
import { hashPassword } from '@/system/sys';
import { createAdminToken } from '@/system/token';
import { ok, fail } from '@/system/call';
import { ACCOUNT_NOT_EXIST, ACCOUNT_PASSWD_INVALID, INVALID_ADMIN_ACCOUNT } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const { username, password } = ctx.body;
  if (!username || !password) {
    return fail(ACCOUNT_PASSWD_INVALID);
  }

  const { data: admin } = await db
    .collection('admin')
    .where({ username })
    .withOne({
      query: db.collection('password').where({ type: 'admin', status: 'active' }),
      localField: '_id',
      foreignField: 'uid',
      as: 'password',
    })
    .getOne();

  // check username and password
  if (!admin) {
    return fail(ACCOUNT_NOT_EXIST);
  }
  const isMatchPassword = admin.password?.password === hashPassword(password);
  if (!isMatchPassword) {
    return fail(ACCOUNT_PASSWD_INVALID);
  }

  if (!admin.status) {
    return fail(INVALID_ADMIN_ACCOUNT);
  }

  const token = await createAdminToken(admin._id);

  return ok({
    uid: admin._id,
    ...token
  });
}
