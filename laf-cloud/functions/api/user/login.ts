import cloud from '@lafjs/cloud';
import { hashPassword } from '@/system/sys';
import { createUserToken } from '@/system/token';
import { ok, fail } from '@/system/call';
import { ACCOUNT_PASSWD_EMPTY, ACCOUNT_PASSWD_INVALID, INVALID_USER_ACCOUNT } from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { username, password } = ctx.body;
  if (!username || !password) {
    return fail(ACCOUNT_PASSWD_EMPTY);
  }

  const { data: user } = await db
    .collection('user')
    .where({ username })
    .withOne({
      query: db.collection('password').where({ type: 'user', status: 'active' }),
      localField: '_id',
      foreignField: 'uid',
      as: 'password',
    })
    .getOne();

  // check username and password
  const isMatchPassword = user.password?.password === hashPassword(password);
  if (!user || !isMatchPassword) {
    return fail(ACCOUNT_PASSWD_INVALID);
  }

  if (!user.status) {
    return fail(INVALID_USER_ACCOUNT);
  }

  const token = await createUserToken(user._id);

  Reflect.deleteProperty(user, 'password');
  user.avatar = user.avatar.length > 0 ? user.avatar[0] : '';
  return ok({
    ...user,
    token,
  });
}
